"use strict"
function noesunacopiaSimulator()
{
  let graphics = {
    Pins: Pins
  };
  return graphics;
}

function Pins(props)
{
  var Informacion = props.pins.map((item, index) => { return (
    <tr>
      <th scope = "row">{index}</th>
      <td>{(item > 0).toString()}</td>
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