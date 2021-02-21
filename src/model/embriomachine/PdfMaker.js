import CharcactersheetJpegBase64 from "@/model/embriomachine/CharcactersheetJpegBase64";
import MachineType from "@/model/embriomachine/machinetype";
import Equipment from "./equipment";

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
            x: 95,
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
            x: 190,
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
            x: 340,
            y: 40
          }
        },
        //名前
        {
          text: this.splitMachineName(machine.name),
          style: {
            fontSize: machine.name.length > 15 ? 11 : 15
          },
          absolutePosition: {
            x: 505,
            y: 30
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
            x: 95,
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
            x: 145,
            y: 200
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
            y: 235
          }
        },
        //単座・複座
        {
          text: machineType.hasDoubleSeat ? "複座" : "単座",
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 145,
            y: 235
          }
        },
        //頭１
        {
          text: machine.getEquipment(MachineType.POSITION_HEAD, 0).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 350,
            y: 110
          }
        },
        //頭2
        {
          text: machine.getEquipment(MachineType.POSITION_HEAD, 1).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 350,
            y: 145
          }
        },
        //頭3
        {
          text: machine.getEquipment(MachineType.POSITION_HEAD, 2).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 350,
            y: 180
          }
        },
        //胴１
        {
          text: this.getBodyEquipment(machine, 0).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 600,
            y: 210
          }
        },
        //胴2
        {
          text: this.getBodyEquipment(machine, 1).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 600,
            y: 245
          }
        },
        //胴3
        {
          text: this.getBodyEquipment(machine, 2).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 600,
            y: 280
          }
        },

        //ダブルバインダー用追加スロット1
        {
          text: this.getDoubleBinderEquipment(machine,0).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 540,
            y: 120
          }
        },
        //ダブルバインダー用追加スロット2
        {
          text: this.getDoubleBinderEquipment(machine,1).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 540,
            y: 155
          }
        },

        //右腕1
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTARM, 0).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 100,
            y: 335
          }
        },
        //右腕2
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTARM, 1).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 100,
            y: 370
          }
        },
        //右腕3
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTARM, 2).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 100,
            y: 405
          }
        },
        //左腕1
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTARM, 0).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 600,
            y: 335
          }
        },
        //左腕2
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTARM, 1).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 600,
            y: 370
          }
        },
        //左腕3
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTARM, 2).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 600,
            y: 405
          }
        },
        //右脚1
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTLEG, 0).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 125,
            y: 460
          }
        },
        //右脚2
        {
          text: machine.getEquipment(MachineType.POSITION_RIGHTLEG, 1).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 125,
            y: 495
          }
        },
        //左脚1
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTLEG, 0).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 580,
            y: 460
          }
        },
        //左脚2
        {
          text: machine.getEquipment(MachineType.POSITION_LEFTLEG, 1).name,
          style: {
            fontSize: 14
          },
          absolutePosition: {
            x: 580,
            y: 495
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

  splitMachineName(machineName) {
    if (machineName.length <= 15) {
      return machineName;
    } else {
      return [machineName.slice(0, 15) + "\r\n", machineName.slice(15)];
    }
  }

  getBodyEquipment(machine, index) {
    if (!machine.isEquipDoubleBinder()) {
      return machine.getEquipment(MachineType.POSITION_BODY, index);
    } else {
      let equipmentLength =
        machine.equipments[MachineType.POSITION_BODY].length;
      let maxIndex = equipmentLength - 2;
      if (index < maxIndex) {
        return machine.getEquipment(MachineType.POSITION_BODY, index);
      } else {
        return new Equipment("");
      }
    }
  }

  getDoubleBinderEquipment(machine, index) {
    if (!machine.isEquipDoubleBinder()) {
      return new Equipment("");
    } else {
      let equipmentLength =
        machine.equipments[MachineType.POSITION_BODY].length;
      return machine.getEquipment(MachineType.POSITION_BODY, equipmentLength - 2 + index);
    }
  }
}
