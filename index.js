
var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

class Game extends React.Component{
static initialState=()=>(
{selectedNumbers:[],
numberOfStars:Game.randomNumber(),
answerIsCorrect:null,
usedNumbers:[],
redraws:5,
doneStatus:null}
);
static randomNumber=()=>1+Math.floor(Math.random()*9);
state=Game.initialState();


selectNumber=(numberClicked)=>{
  if(this.state.selectedNumbers.indexOf(numberClicked)>=0){
  return 
  }
  this.setState(prevState=>({
  answerIsCorrect:null,
  selectedNumbers:prevState.selectedNumbers.concat(numberClicked)
}));
}

 unselectNumber=(numberClicked)=>{
 this.setState(prevState=>({
 answerIsCorrect:null,
 selectedNumbers:prevState.selectedNumbers.filter(number=>number!==numberClicked)
 }));
 }
 
 checkAnswer=()=>{
 this.setState(prevState=>({
 answerIsCorrect:prevState.numberOfStars===prevState.selectedNumbers.reduce((acc,n)=>acc+n,0)
 })
 )
 };
 acceptAnswer=()=>{
 this.setState(prevState=>({
 usedNumbers:prevState.usedNumbers.concat(prevState.selectedNumbers),
 selectedNumbers:[],
	answerIsCorrect:null,
  numberOfStars:Game.randomNumber()
  
 }),this.updateDoneStatus)
 }
 
reDraw=()=>{
  if(this.state.redraws==0){
  return
  }
  this.setState(prevState=>({
  selectedNumbers:[],
  answerIsCorrect:[],
  numberOfStars:Game.randomNumber(),
  redraws:prevState.redraws-1
  }),this.updateDoneStatus)
}

updateDoneStatus=()=>{
  this.setState(prevState=>{
  if(this.state.usedNumbers===9){
  return {doneStatus:"Nice Play"}
  }
  if(this.state.redraws==0 && !this.possibleSolutions(prevState))
  return{doneStatus:"Game Over"}
  })
}
//object destructreing 
possibleSolutions=({numberOfStars,usedNumbers})=>{
const possibleNumbers=_.range(1,10).filter(number=>
usedNumbers.indexOf(number)===-1
);
return possibleCombinationSum(possibleNumbers,numberOfStars);
}
//resetting Game
resetGame=()=>{
this.setState(Game.initialState())
}

render(){
return <div>
  <h2>Star Nine</h2>
    <hr/>
  <div className='row container'>
    <Star numberOfStars={this.state.numberOfStars}/>
    <Button selectedNumbers={this.state.selectedNumbers} answerIsCorrect={this.state.answerIsCorrect} checkAnswer={this.checkAnswer} acceptAnswer={this.acceptAnswer} redraws={this.state.redraws} reDraw={this.reDraw}/>
    <Answer selectedNumbers={this.state.selectedNumbers} deselectNumber={this.unselectNumber}/>
  </div>
  <br/>
  {this.state.doneStatus ?
  	<Donepanel doneStatus={this.state.doneStatus} resetGame={this.resetGame}/>:
  	<Number selectedNumbers={this.state.selectedNumbers}  usedNumbers={this.state.usedNumbers} selectNumber={this.selectNumber}/>
    }
</div>
}
}

const Star =(props)=>{

return (
<div className="col-5">
{
_.range(props.numberOfStars).map((number,i)=>
<i className='fa fa-star'></i>)}
</div>
)
}
const Button = (props)=>{
let button;
switch(props.answerIsCorrect){
case true:
button=
<button className='btn btn-success' onClick={props.acceptAnswer}>
<i className='fa fa-check'></i></button>

break;
case false:
button=
<button className='btn btn-danger'><i className='fa fa-times'></i></button>

break;
default:
button=

<button className='btn' onClick={props.checkAnswer} disabled={props.selectedNumbers.length===0}>=</button>

break;
}
return(
<div className='col-3'>
{button}

<br/>
<button className='btn btn-warning btn-sm' onClick={props.reDraw} disabled={props.redraws===0}><i className='fa fa-refresh'></i>{props.redraws}</button>
</div>
);
}


const Donepanel=(props)=>{
return(
<div>
<h1>{props.doneStatus}</h1>
<button className="btn btn-primary" onClick={props.resetGame}>Play Again!</button>
</div>

)
}
const Answer =(props)=>{
return(
<div className='col-4'>
  {props.selectedNumbers.map((number,i)=>
  <span key={i} onClick={()=>props.deselectNumber(number)} >{number}</span>
  )}
</div>
)
}

const Number =(props)=>{

const numberClassName=(number)=>{
if(props.selectedNumbers.indexOf(number)>=0){
return "selected";
}
if(props.usedNumbers.indexOf(number)>=0){
return "used";
}
}
return(
<div className='text-center numbers'>
{Number.list.map((number,i)=>
<span key={i} onClick={()=>props.selectNumber(number)} className={numberClassName(number)} >{number}</span>
)}
</div> 
)
}
Number.list=_.range(1,10);


class App extends React.Component{
render(){
return <div>
<Game/>
</div>
}
}
ReactDOM.render(<App/>,mountNode);
