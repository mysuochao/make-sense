import {AnnotationFormatType} from "./enums/AnnotationFormatType";
import {AnnotationImporter} from "../logic/import/AnnotationImporter";
import {COCOImporter} from "../logic/import/coco/COCOImporter";
import {YOLOImporter} from "../logic/import/yolo/YOLOImporter";
import {VOCImporter} from "../logic/import/voc/VOCImporter"

export type ImporterSpecDataMap = { [s in AnnotationFormatType]: typeof AnnotationImporter; };


export const ImporterSpecData: ImporterSpecDataMap = {
    COCO: COCOImporter,
    CSV: undefined,
    JSON: undefined,
    VGG: undefined,
    VOC: VOCImporter,
    YOLO: YOLOImporter
}