import CharcactersheetJpegBase64 from "@/model/embriomachine/CharcactersheetJpegBase64";
import MachineType from '@/model/embriomachine/machinetype'

export default class PdfMaker {

  printPdf(machine, file) {
    let imageSize = null;
    if (file != "") {
      //ファイルサイズを取得。
      var img = document.createElement("img");
      img.src = file;
      imageSize = this.calcPdfImageSize(img.height, img.width, 320, 250);
    }

    let machineType = machine.machineType;

    //pdfMakeはindex.htmlで読み込み、定義されている。
    pdfMake.fonts = {
      GenShin: {
        normal: "GenShinGothic-Normal-Sub.ttf",
        bold: "GenShinGothic-Normal-Sub.ttf",
        italics: "GenShinGothic-Normal-Sub.ttf",
        bolditalics: "GenShinGothic-Normal-Sub.ttf"
      }
    };
    const defaultStyle = "GenShin";
    let docDefinition = {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [0, 0, 0, 0],
      content: [
        //背景画像
        {
          image: CharcactersheetJpegBase64.base64,
          width: 850
        },
        //イニシアチブ
        {
          text: machineType.initiative,
          style: {
            fontSize: 20
          },
          absolutePosition: {
            x: 100,
            y: 45
          }
        },
        //移動値
        {
          text: machineType.movility,
          style: {
            fontSize: 20
          },
          absolutePosition: {
            x: 190,
            y: 45
          }
        },
        //回避値
        {
          text: machineType.evadeRate,
          style: {
            fontSize: 20
          },
          absolutePosition: {
            x: 340,
            y: 45
          }
        },
        //名前
        {
         text: this.splitMachineName(machine.name),
         style: {
           fontSize: machine.name.length > 15 ? 13 : 15
         },
         absolutePosition: {
           x: 530,
           y: 35
         }
        },
        //装甲値
        {
          text: machineType.armorPoint,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 150,
            y: 100
          }
        },
        //スロット
        {
          text: machineType.getTotalSlot(),
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 150,
            y: 135
          }
        },
        //耐久値
        {
          text: machineType.constitution,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 150,
            y: 170
          }
        },
        //突撃
        {
          text: machineType.chargeDamage,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 255,
            y: 100
          }
        },
        //被突撃
        {
          text: machineType.coveredChargeDamage,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 255,
            y: 135
          }
        },
        //サイズ
        {
          text: machineType.size,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 95,
            y: 205
          }
        },
        //重量
        {
          text: machineType.weight,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 145,
            y: 205
          }
        },
        //Aランク数
        {
          text: machine.getARankEquipmentCount(),
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 95,
            y: 240
          }
        },
        //単座・複座
        {
          text: machineType.hasDoubleSeat ? "複座" : "単座",
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 145,
            y: 240
          }
        },
        //頭１
        {
          text: machine.getEquipment(MachineType.POSITION_HEAD, 0).name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 350,
            y: 115
          }
        },
        //頭2
        {
          text: machine.getEquipment(MachineType.POSITION_HEAD, 1).name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 350,
            y: 150
          }
        },
        //頭3
        {
          text: machine.getEquipment(MachineType.POSITION_HEAD, 2).name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 350,
            y: 185
          }
        },
        //胴１
        {
          text: machine.getEquipment(MachineType.POSITION_BODY, 0).name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 595,
            y: 195
          }
        },
        //胴2
        {
          text: machine.getEquipment(MachineType.POSITION_BODY, 1).name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 595,
            y: 230
          }
        },
        //胴3
        {
          text: machine.getEquipment(MachineType.POSITION_BODY, 2).name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 595,
            y: 265
          }
        },
        //右腕1
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTARM, 0)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 105,
            y: 320
          }
        },
        //右腕2
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTARM, 1)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 105,
            y: 355
          }
        },
        //右腕3
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTARM, 2)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 105,
            y: 390
          }
        },
        //左腕1
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTARM, 0)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 595,
            y: 320
          }
        },
        //左腕2
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTARM, 1)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 595,
            y: 355
          }
        },
        //左腕3
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTARM, 2)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 595,
            y: 390
          }
        },
        //右脚1
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTLEG, 0)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 125,
            y: 450
          }
        },
        //右脚2
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTLEG, 1)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 125,
            y: 485
          }
        },
        //左脚1
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTLEG, 0)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 570,
            y: 450
          }
        },
        //左脚2
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTLEG, 1)
            .name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 570,
            y: 485
          }
        }
      ],

      defaultStyle: {
        font: defaultStyle
      },
      styles: {
        header: {
          fontSize: 30
        },
        subheader: {
          fontSize: 20
        }
      }
    };

    //画像を添付した場合は画像出力の定義を追加
    if (file != "") {
      docDefinition.content.push(
        //添付画像
        {
          image: file,
          width: imageSize.witdh,
          height: imageSize.height,
          //中央に出すように位置調整
          absolutePosition: {
            x: 300 + (250 - imageSize.witdh) / 2,
            y: 220 + (320 - imageSize.height) / 2
          }
        }
      );
    }
    // let fileName = machine.name + "pdf";
    let fileName = machine.name;
    pdfMake.createPdf(docDefinition).download(fileName);
  }

  // width: 250,
  // height: 320,
  calcPdfImageSize(height, witdh, maxHeight, maxWitdh) {
    let retVal = {
      height: maxHeight,
      witdh: maxWitdh
    };

    let imageFileMaginfication = height / witdh;
    let maxMaginfication = maxHeight / maxWitdh;

    if (imageFileMaginfication > maxMaginfication) {
      retVal.witdh = witdh * (maxHeight / height);
    } else {
      retVal.height = height * (maxWitdh / witdh);
    }
    return retVal;
  }

  splitMachineName(machineName){
    if(machineName.length <= 15){
      return machineName
    } else {
      return [machineName.slice(0,15)+"\r\n",machineName.slice(15)]
    }
  }
}
