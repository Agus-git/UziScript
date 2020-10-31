"use strict"
class TablaDePins
{
  constructor(props)
  {
    this.pins = props.pins;
    this.Pins = Pins.bind(this);
    this.paint(this.pins);
  }
  update(props)
  {
    this.paint(props.pins);
  }
  paint(props)
  {
    const domContainer = document.querySelector("#pinsTable");
    ReactDOM.render(Pins(props),domContainer);
  }
}

function Pins(props)
{
  var Informacion = props.map((item, index) => { return (
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