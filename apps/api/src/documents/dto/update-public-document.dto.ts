import { PartialType } from "@nestjs/mapped-types";
import { CreatePublicDocumentDto } from "./create-public-document.dto";

export class UpdatePublicDocumentDto extends PartialType(CreatePublicDocumentDto) {}
