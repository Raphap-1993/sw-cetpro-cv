import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Program } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";

const publicProgramListSelect = Prisma.validator<Prisma.ProgramSelect>()({
  id: true,
  title: true,
  slug: true,
  summary: true,
  duration: true,
  modality: true,
  imageUrl: true
});

const publicProgramDetailSelect = Prisma.validator<Prisma.ProgramSelect>()({
  id: true,
  title: true,
  slug: true,
  summary: true,
  description: true,
  studyPlan: true,
  duration: true,
  modality: true,
  imageUrl: true
});

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.program.findMany({
      orderBy: this.programOrderBy
    });
  }

  findPublished() {
    return this.prisma.program.findMany({
      where: { status: "PUBLISHED" },
      select: publicProgramListSelect,
      orderBy: this.programOrderBy
    });
  }

  async findPublishedBySlug(slug: string) {
    const program = await this.prisma.program.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: publicProgramDetailSelect
    });

    if (!program) {
      throw new NotFoundException("Programa no encontrado.");
    }

    return program;
  }

  async create(dto: CreateProgramDto) {
    return this.prisma.$transaction(async (tx) => {
      const orderedPrograms = await this.normalizePositions(tx);
      const created = await tx.program.create({
        data: {
          ...dto,
          position: orderedPrograms.length
        }
      });

      if (dto.position === undefined) {
        return created;
      }

      await this.moveProgramToIndex(tx, created.id, dto.position);

      return this.findProgramById(tx, created.id);
    });
  }

  async update(id: string, dto: UpdateProgramDto) {
    return this.prisma.$transaction(async (tx) => {
      await this.findProgramById(tx, id);

      const { position, ...data } = dto;
      const updated =
        Object.keys(data).length > 0
          ? await tx.program.update({
              where: { id },
              data
            })
          : await this.findProgramById(tx, id);

      if (position === undefined) {
        return updated;
      }

      await this.normalizePositions(tx);
      await this.moveProgramToIndex(tx, id, position);

      return this.findProgramById(tx, id);
    });
  }

  async reorder(id: string, direction: "up" | "down") {
    return this.prisma.$transaction(async (tx) => {
      const orderedPrograms = await this.normalizePositions(tx);
      const currentIndex = orderedPrograms.findIndex(
        (program) => program.id === id
      );

      if (currentIndex === -1) {
        throw new NotFoundException("Programa no encontrado.");
      }

      const nextIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex < 0 || nextIndex >= orderedPrograms.length) {
        return this.findProgramById(tx, id);
      }

      const reorderedPrograms = [...orderedPrograms];
      [reorderedPrograms[currentIndex], reorderedPrograms[nextIndex]] = [
        reorderedPrograms[nextIndex],
        reorderedPrograms[currentIndex]
      ];

      await this.persistProgramPositions(tx, reorderedPrograms);

      return this.findProgramById(tx, id);
    });
  }

  private get programOrderBy(): Prisma.ProgramOrderByWithRelationInput[] {
    return [
      { position: "asc" },
      { title: "asc" },
      { slug: "asc" },
      { id: "asc" }
    ];
  }

  private async findProgramById(tx: Prisma.TransactionClient, id: string) {
    const program = await tx.program.findUnique({
      where: { id }
    });

    if (!program) {
      throw new NotFoundException("Programa no encontrado.");
    }

    return program;
  }

  private async normalizePositions(tx: Prisma.TransactionClient) {
    const orderedPrograms = await tx.program.findMany({
      select: {
        id: true,
        position: true
      },
      orderBy: this.programOrderBy
    });

    await this.persistProgramPositions(tx, orderedPrograms);

    return orderedPrograms.map((program, index) => ({
      ...program,
      position: index
    }));
  }

  private async moveProgramToIndex(
    tx: Prisma.TransactionClient,
    id: string,
    targetIndex: number
  ) {
    const orderedPrograms = await tx.program.findMany({
      select: {
        id: true,
        position: true
      },
      orderBy: this.programOrderBy
    });
    const currentIndex = orderedPrograms.findIndex((program) => program.id === id);

    if (currentIndex === -1) {
      throw new NotFoundException("Programa no encontrado.");
    }

    const nextIndex = Math.max(
      0,
      Math.min(targetIndex, orderedPrograms.length - 1)
    );

    if (currentIndex === nextIndex) {
      return;
    }

    const reorderedPrograms = [...orderedPrograms];
    const [currentProgram] = reorderedPrograms.splice(currentIndex, 1);
    reorderedPrograms.splice(nextIndex, 0, currentProgram);

    await this.persistProgramPositions(tx, reorderedPrograms);
  }

  private async persistProgramPositions(
    tx: Prisma.TransactionClient,
    programs: Array<Pick<Program, "id" | "position">>
  ) {
    for (const [index, program] of programs.entries()) {
      if (program.position === index) {
        continue;
      }

      await tx.program.update({
        where: { id: program.id },
        data: { position: index }
      });
    }
  }
}
