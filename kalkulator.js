class RockState{
  constructor(max=10) {
    this.percent = 75;
    this.tries = [0,0,0]
    this.hits = [0,0,0]
    this.max = max
  }
 
  toKey() {
    return this.percent +'_' + this.tries.join('_') + '_' + this.hits.join('_')
  }
 
  fromKey(key) {
    let array = key.split("_")
    this.percent = parseInt(array[0])
    for (let i = 0; i < 3; i++) {
      this.tries[i] = pareInt(array[i+1])
      this.hits[i] = pareInt(array[i+4])
    }
  }
 
 
  fromState(other) {
    this.percent = other.percent
    for (let i = 0; i < 3; i++) {
      this.tries[i] = other.tries[i]
      this.hits[i] = other.hits[i]
    }
	return this;
  }
 
  trigger(row, val) {
    if (this.tries[row] >= this.max) return;
    this.tries[row]++;
    this.hits[row] += val;
    this.percent += val ? -10:10
    this.percent = Math.min(Math.max(25, this.percent), 75)
  }
 
  randHit(row) {
    if (Math.random() * 100 < this.percent) {
		this.trigger(row, 1)
	} else {
		this.trigger(row, 0)
	}
  }
}
 
class UIRockState extends RockState {
  constructor(max = 10) {
    super(max)
	this.states = {}
    this.rows = [[],[],[]]
    this.updateui()
  }
 
  reset() {
    console.log("ok")
    this.percent = 75;
    this.tries = [0,0,0]
    this.hits = [0,0,0]
    this.rows = [[],[],[]]
    this.updateui()
 
  }
 
  updateui() {
    document.getElementById("percentDisplay").innerHTML = this.percent+"%"
    for (let i = 0; i < 3; i++) {
      let row = document.getElementById("row" + i).children[0];
      let temp = []
      for (let j = 0; j < this.max; j++) {
        let val = ""
         if (j >= this.rows[i].length)
          val = "☐"
        else if (this.rows[i][j] == 0)
          val = "✖"
        else 
          val = "✓"
       temp.push(val)
      }
      row.innerHTML = temp.join("&nbsp&nbsp&nbsp")
    }
	this.getAction()
  }
 
  trigger(row, val) {
    super.trigger(row, val)
    this.rows[row].push(val)
    this.updateui()
  }
 
  getAction() {
	let actionElement = document.getElementById("actionElement")
	let valueElement = document.getElementById("valueElement")
	if (!(this.toKey() in this.states)) {
		actionElement.innerHTML = "No action found for current state"
		valueElement.innerHTML = "0"
		return;
	}
	actionElement.innerHTML = "Row " + (this.states[this.toKey()][1] + 1)
	valueElement.innerHTML = this.states[this.toKey()][0]
 
  }
 
  importStates() {
	let stateName = document.getElementById("stateName").value
	fetch('./' + stateName)
    .then((response) => response.json())
    .then((json) => console.log(json));
  }
}  
 
function readFile(file, ui) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    ui.states = JSON.parse(result);
	ui.updateui()
  });
 
  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsText(file);
}
 
let ui = new UIRockState();
 
document.getElementById("importButton").addEventListener('change', (event) => {
    readFile(event.target.files[0], ui)
  });