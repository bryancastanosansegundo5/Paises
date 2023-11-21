import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import "./styles/paises.css";

const Paises = ({
  pais: { name, flag, capital, languages, population, currencies },
}) => {
  let poblacionFormateada = population.toLocaleString();
  let array = [];
  let arrayActu = [];
  languages.forEach((elemento) => {
    array.push(elemento.name);
  });

  let languagesFormateada = array.join(", ");

  if (currencies === undefined) {
    arrayActu.push("No hay información de la moneda disponible");
  } else {
    currencies.forEach((elemento) => {
      elemento = elemento.name;
      arrayActu.push(elemento);
    });
  }

  let currenciesFormateada = arrayActu.join(", ");

  return (
    <div className="pais">
      <div className="pais_bandera">
        <img src={flag} alt={name} />
      </div>
      <h3 className="pais_nombre">{name.toUpperCase()}</h3>
      <div className="pais_texto">
        <p>
          <span>Capital: {capital}</span>
          <br />
          <span>Lenguaje: {languagesFormateada}</span>
          <br />
          <span>Poblanción: {poblacionFormateada} </span>
          <br />
          <span>Moneda: {currenciesFormateada} </span>
        </p>
      </div>
    </div>
  );
};
const Grafico = ({ datosSeleccion }) => {
  datosSeleccion = datosSeleccion.sort((a, b) => b.valor - a.valor);
  let total = datosSeleccion.length > 0 ? datosSeleccion[0].valor : 0;
  return (
    <div className="graficoWrapper">
      {datosSeleccion.map((elemento) => (
        <div className="barras" key={elemento.name}>
          <div>{elemento.name}</div>
          <div
            className="barra"
            style={{
              width: `${(elemento.valor / total) * 100}%`,
              height: "35px",
            }}
          ></div>
          <div>{elemento.valor}</div>
        </div>
      ))}
    </div>
  );
};
const App = (props) => {
  const [data, setData] = useState([]);
  const [dataFiltrada, setDataFiltrada] = useState([]);
  const [datosSeleccion, setDatosSeleccion] = useState([]);
  const [tipo, setTipo] = useState("");
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dataFiltrada.length > 0) {
      handleButtonClick("poblacion");
    }
  }, [dataFiltrada]);
  const fetchData = async () => {
    const url = "https://restcountries.com/v2/all";
    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      setDataFiltrada(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    const resultado = data.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(inputValue);
      const capitalMatch = item.capital
        ? item.capital.toLowerCase().includes(inputValue)
        : false;
      const languageMatch = item.languages.some((a) =>
        a.name.toLowerCase().includes(inputValue)
      );
      return nameMatch || capitalMatch || languageMatch;
    });
    setDataFiltrada(resultado);
  };
  const handleButtonClick = (tipo) => {
    let top10 = [];
    const datos = [...dataFiltrada];
    if (tipo === "poblacion") {
      let max = 0;
      for (let index = 0; index < datos.length; index++) {
        max += datos[index].population;
      }
      let paisesOrdenados = datos.sort((a, b) => b.population - a.population);
      let paisesMasGrandes = paisesOrdenados.slice(0, 10);
      top10 = paisesMasGrandes.map((pais) => ({
        name: pais.name,
        valor: pais.population,
      }));

      top10.push({
        name: "World",
        valor: max,
      });
      setTipo(tipo);
    } else if (tipo === "lenguajes") {
      let max = 0;

      let lenguajes = [];
      for (let i = 0; i < datos.length; i++) {
        for (let index = 0; index < datos[i].languages.length; index++) {
          lenguajes.push(datos[i].languages[index].name);
        }
      }
      let repeticionIdiomas = {};

      for (let i = 0; i < lenguajes.length; i++) {
        const lenguaje = lenguajes[i];
        repeticionIdiomas[lenguaje] = (repeticionIdiomas[lenguaje] || 0) + 1;
      }

      const idiomasOrdenados = Object.keys(repeticionIdiomas).sort(
        (a, b) => repeticionIdiomas[b] - repeticionIdiomas[a]
      );
      const idiomasMasHablados = idiomasOrdenados.slice(0, 10);

      top10 = idiomasMasHablados.map((idioma) => ({
        name: idioma,
        valor: repeticionIdiomas[idioma],
      }));

      top10.push({
        name: "World",
        valor: max,
      });
    }
    setDatosSeleccion(top10);
  };

  return (
    <div className="App">
      <a href="#root" className="flecha-link">
        <i className="fas fa-arrow-alt-circle-up"></i>
      </a>
      <header id="paises" className="pais-header">
        <h2 className="">Países del Mundo</h2>
        <p className="subtitulo">
          Actualmente, tenemos {dataFiltrada.length} países
        </p>
      </header>
      <div className="controles">
        <input
          className="busqueda-input"
          type="text"
          placeholder="Busca un pais por nombre, ciudad o lenguas"
          onChange={handleChange}
        />
        <div>
          <a href="#grafico">
            <i className="fas fa-chart-bar"></i>
          </a>
        </div>
      </div>
      <div>
        <div className="paises-wrapper">
          {dataFiltrada.map((pais) => (
            <Paises pais={pais} key={pais.name} />
          ))}
        </div>
        <div className="grafico-wrapper">
          <div className="grafico-botones">
            <button
              className={tipo === "poblacion" ? "active" : ""}
              onClick={() => handleButtonClick("poblacion")}
              autoFocus
            >
              Población
            </button>
            <button
              className={tipo === "lenguajes" ? "active" : ""}
              onClick={() => handleButtonClick("lenguajes")}
            >
              Lenguajes
            </button>
          </div>
          <h4 className="grafico-title">10 Lenguajes más hablados</h4>
          <a href="#root">
            <i className="fas fa-chart-bar"></i>
          </a>
          <div className="graficos"></div>
          <div className="grafico-wrapper" id="grafico">
            <Grafico datosSeleccion={datosSeleccion} />
          </div>
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
