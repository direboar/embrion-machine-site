import CharcactersheetJpegBase64 from "@/model/embriomachine/CharcactersheetJpegBase64";
import MachineType from '@/model/embriomachine/machinetype'

export default class PdfMaker {

  printPdf(machine, file) {
    let imageSize = null;
    if (file != "") {
      //ファイルサイズを取得。
      var img = document.createElement("img");
      img.src = file;
      imageSize = this.calcPdfImageSize(img.height, img.width, 340, 250);
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
            y: 40
          }
        },
        //移動値
        {
          text: machineType.movility,
          style: {
            fontSize: 20
          },
          absolutePosition: {
            x: 185,
            y: 40
          }
        },
        //回避値
        {
          text: machineType.evadeRate,
          style: {
            fontSize: 20
          },
          absolutePosition: {
            x: 280,
            y: 40
          }
        },
        //名前
        {
          text: machine.name,
          style: {
            fontSize: machine.name.length > 20 ? 10 : 16
          },
          absolutePosition: {
            x: 460,
            y: 33
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
            y: 95
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
            y: 130
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
            y: 165
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
            y: 95
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
            y: 130
          }
        },
        //サイズ
        {
          text: machineType.size,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 100,
            y: 200
          }
        },
        //重量
        {
          text: machineType.weight,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 150,
            y: 200
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
            y: 125
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
            y: 160
          }
        },
        //胴１
        {
          text: machine.getEquipment(MachineType.POSITION_BODY, 0).name,
          style: {
            fontSize: 15
          },
          absolutePosition: {
            x: 565,
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
            x: 565,
            y: 230
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
            x: 110,
            y: 305
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
            x: 110,
            y: 340
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
            x: 110,
            y: 375
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
            x: 590,
            y: 305
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
            x: 590,
            y: 340
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
            x: 590,
            y: 375
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
            x: 135,
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
            x: 135,
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
            x: 565,
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
            x: 565,
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
            y: 190 + (340 - imageSize.height) / 2
          }
        }
      );
    }
    // let fileName = machine.name + "pdf";
    let fileName = machine.name;
    pdfMake.createPdf(docDefinition).download(fileName);
  }

  // width: 250,
  // height: 340,
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
}
