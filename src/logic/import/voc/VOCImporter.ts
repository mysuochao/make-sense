import {ImageData, LabelName} from "../../../store/labels/types";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {AnnotationImporter, ImportResult} from "../AnnotationImporter";
import {ImageDataUtil} from "../../../utils/ImageDataUtil";
import {LabelUtil} from "../../../utils/LabelUtil";
import {parse} from 'fast-xml-parser';
import {
    VOCAnnotationsLoadingError
} from "./VOCErrors";
import {COCOObject} from "../../../data/labels/COCO";
import uuidv4 from "uuid/v4";
export class VOCImporter extends AnnotationImporter {
    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {

        for (var index in filesData) {
            const reader = new FileReader();
            reader.readAsText(filesData[index]);
            reader.onloadend = (evt: any) => {
                var xml = parse(evt.target.result)
                var annos = xml.annotation.object;
                var filename = xml.annotation.filename

                const inputImagesData: ImageData[] = LabelsSelector.getImagesData();
                const {imagesData, labelNames} = this.applyLabels(inputImagesData, filename, annos);
                onSuccess(imagesData,labelNames);
            }
        }

    }

    public applyLabels(imageData: ImageData[], filename, annotations): ImportResult {

        const currentImage = imageData.find( item => item.fileData.name === filename);
        if(currentImage) {
            currentImage.labelRects=[];
            for (const anno of annotations) {
                let labelName = anno.name;
                let currentLabel = this.getLabelByName(labelName);
                if(!currentLabel){
                    currentLabel = {name: labelName, id: uuidv4()};
                    LabelsSelector.getLabelNames().push(currentLabel);
                }
                let xmin = anno.bndbox.xmin;
                let ymin = anno.bndbox.ymin;
                let xmax = anno.bndbox.xmax;
                let ymax = anno.bndbox.ymax;

                currentImage.labelRects.push(LabelUtil.createLabelRect(currentLabel.id, {x:xmin, y:ymin, height: (ymax - ymin),width:(xmax - xmin)}))
            }
        }

        return {
            imagesData: imageData,
            labelNames: LabelsSelector.getLabelNames()
        }
    }

    public getLabelByName(name):LabelName {
        return LabelsSelector.getLabelNames().find( label => label.name === name);
    }
}