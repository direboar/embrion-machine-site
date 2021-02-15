const fs = require("fs");

const text = fs.readFileSync("./a.csv","utf-8");
// console.log(text);


const retVal = []

text.split("\r\n").forEach(line=>{
  const splitted = line.split("\t")
  let count = 0
  const object = {
    name: splitted[count++], 
    rank: splitted[count++], 
    type: splitted[count++], 
    range: splitted[count++], 
    minRange: splitted[count++], 
    maxRange: splitted[count++], 
    rangeType: splitted[count++], 
    damage: splitted[count++], 
    damageType: splitted[count++], 
    mountPosition: splitted[count++], 
    minLimit: parseInt(splitted[count++]), 
    equipSamePosition: splitted[count++], 
    effect: splitted[count++],
    maxLimit: parseInt(splitted[count++]), 
    edition : splitted[count++], 
  }
  retVal.push(object)

})

const output = JSON.stringify(retVal,null,"\t")
fs.writeFileSync("./a.json",output,"utf-8");

//constructor(name,movility,evadeRate,armorPoint,constitution,initiative,headSlot,bodySlot,leftArmSlot,rightArmSlot,leftLegSlot,rightLegSlot) {
