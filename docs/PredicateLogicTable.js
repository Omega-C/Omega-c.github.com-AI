class Table {
	constructor() {
		this.replacables={"⇒":"<=","->":"<=","→":"<=","⊃":"<=","<->":"==","⇔":"==","≡":"==","⟷":"==","¬":"1^","~":"1^","!":"1^","∧":"&","∨":"|","⊤":"1","⊥":"0"}
		this.replaceList={"(1)":"1","(0)":"0","1^0":"1","1^1":"0","()":""}
		for (let symbol of ["&","|","<=","=="]) {
			for (let [a,b] of this.binaryMake(2)) {
				this.replaceList[`${a}${symbol}${b}`]=Number(eval(`${a}${symbol}${b}`)).toString()
			}
		}

	}
	sanitise(str) {
		return(str)
	}
	readVariables(str) {
		let varRegex=/\w+/g
		return([...(new Set([...str.matchAll(varRegex)].map(x=>{return(x[0])})))].sort((a, b)=>{return(b.length-a.length)}))
	}
	binaryMake(varint) {
		let binaryList=[]
		for (let n=0; n<2**varint;n++) {
			binaryList.push(Number(n).toString(2).padStart(varint,"0").split(""))
		}
		return(binaryList)
	}
	replaceVars(str) {
		for (let key in this.replacables) {
			str=str.replaceAll(key,this.replacables[key])
		}
		return(str)
	}
	tableInterpretation(arr) {
		if ((arr.includes("1"))&(arr.includes("0"))) {return("Possible")}
		if (arr.includes("1")) {return("Tautology")}
		if (arr.includes("0")) {return("Contradiction")}
		return("Vacuous")
	}
	checkForReplaceOut(str) {
		let bool=false
		for (let key in this.replaceList) {
			console.log()
			bool=bool|(str.includes(key))
		}
		return(bool)
	}
	replaceOut(str) {
		while (this.checkForReplaceOut(str)) {
			for (let key in this.replaceList) {
				str=str.replaceAll(key,this.replaceList[key])
			}
		}
		return(str)
	}
	makeTable(str) {
		str=this.sanitise(str)
		let resultant=[]
		let variables=this.readVariables(str)
		let binaryKey=this.binaryMake(variables.length).reverse()
		str=this.replaceVars(str)
		binaryKey.forEach((item,index)=>{
			let news=str
			for (let n=0;n<item.length;n++) {
				news=news.replaceAll(variables[n],item[n])
			}
			resultant.push(this.replaceOut(news))
		})
		return([variables,resultant,binaryKey,this.tableInterpretation(resultant)])
	}
	makeTableEval(str) {
		/*do not use unless the input is trustworthy*/
		str=this.sanitise(str)
		let resultant=[]
		let variables=this.readVariables(str)
		let binaryKey=this.binaryMake(variables.length).reverse()
		str=this.replaceVars(str)
		binaryKey.forEach((item,index)=>{
			let news=str
			for (let n=0;n<item.length;n++) {
				news=news.replaceAll(variables[n],item[n])
			}
			resultant.push(eval(news).toString())
		})
		return([variables,resultant,binaryKey,this.tableInterpretation(resultant)])
	}
}
function models(table,propositions,conclusion) {
	let prop=`((${propositions.join(")&(")}))`
	let propTable=table.makeTable(prop)
	if (!propTable[1].includes("1")) {return("Vacuous Truth")}
	let modelSyntax=prop+`<=(${conclusion})`
	let modelTable=table.makeTable(modelSyntax)
	console.log(modelSyntax,modelTable)
	if (modelTable[1].includes("0")) {return("Does Not Model")}
	return("Models")
}
