const fs = require("fs");

const text = fs.readFileSync("./b.csv","utf-8");
// console.log(text);


const retVal = []

text.split("\r\n").forEach(line=>{
  const splitted = line.split("\t")
  let count = 0
  const object = {
    name: splitted[count++], 
    rank: splitted[count++], 
    classification: splitted[count++], 
    type: splitted[count++], 
    effect: splitted[count++], 
  }
  retVal.push(object)

})

const output = JSON.stringify(retVal,null,"\t")
fs.writeFileSync("./b.json",output,"utf-8");

function toBoolean(booleanStr) {
  return booleanStr.toLowerCase() === "true";
}
//constructor(name,movility,evadeRate,armorPoint,constitution,initiative,headSlot,bodySlot,leftArmSlot,rightArmSlot,leftLegSlot,rightLegSlot) {
