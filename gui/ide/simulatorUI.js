"use strict"
function noesunacopiaSimulator()
{
  let graphics = {
    Pins: Pins
  };
  return graphics;
}
const test = (
<table className="table table-sm table-dark">
<thead>
  <tr>
    <th scope="col">#</th>
    <th scope="col">Estado</th>
    <th scope="col">Last</th>
    <th scope="col">Handle</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th scope="row">1</th>
    <td>Mark</td>
    <td>Otto</td>
    <td>@mdo</td>
  </tr>
  <tr>
    <th scope="row">2</th>
    <td>Jacob</td>
    <td>Thornton</td>
    <td>@fat</td>
  </tr>
  <tr>
    <th scope="row">3</th>
    <td colSpan="2">Larry the Bird</td>
    <td>@twitter</td>
  </tr>
</tbody>
</table>);
function Pins(props)
{
  Informacion = props.pins.map((item, index) => { return (
    <tr>
      <th scope = "row">{index}</th>
      <td>{item > 0}</td>
      <td>{item}</td>
    </tr>
  )})
  return(
    <table className = "table table-striped table-dark">
      <thead>
        <tr>
          <th scope = "col">#</th>
          <th scope = "col">Estado</th>
          <th scope = "col">Valor</th>
        </tr>
      </thead>
      <tbody>
        {Informacion}
      </tbody>
    </table>
  );
}
const domContainer = document.querySelector("#pinsTable");
ReactDOM.render(Pins,domContainer);