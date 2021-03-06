import axios from 'axios';
import Head from 'next/head'
import { useEffect } from 'react';
import BrowserScript from "../lib/core/views"
import styles from '../styles/Home.module.css'
import { setupCache } from 'axios-cache-adapter'
const cache = setupCache({
  maxAge: 15 * 60 * 1000
})

const api = axios.create({
  adapter: cache.adapter
})

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];

const data = {
  labels: labels,
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [100, 10, 5, 2, 20, 30, 45],
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {responsive: false}
};

let _bs = null;
const initialize = () => {
  const bs = new BrowserScript(window.document.getElementById('main-view'))
  const code = async function() {
    bs.text("## Calculate your taxes!");
    const file = bs.fileInput("Upload your Image", {as: 'image'});
    if (file) {
      bs.image(file, {width: 100, height: 'auto'});
    }
    const formattedData = bs.dataTable(
      [
        { field: "make", editable: true },
        { field: "model", editable: true },
        { field: "price", editable: true },
      ],
      [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 }
      ],
    );
    bs.text("Responding to: " + formattedData[0].make);
    bs.iframe("https://www.youtube.com/embed/dXBohfjc4WA")
    const date = bs.dateInput("What is the current time?")
    bs.text(`Current Date: ${date}`);
    const time = bs.timeInput("What is the current time?")
    bs.text(`Current Time: ${time}`);
    const country = bs.radio("Where do you live?", ["Canada", "United States"]);
    bs.text(`Your Country: ${country ? country : ""}`);
    if (bs.button("Click here to show stuff")) {
      bs.text("Hello world!");
    }
    const value = bs.input(
      "Your annual income",
      {
        defaultValue: 0,
        placeholder: "Ex: 10000",
        type: "number",
      }
    );
    const taxRate = bs.slider(
      "Your Tax Rate",
      {
        defaultValue: 0,
        min: 0,
        max: 100,
        type: "number",
      });
    bs.chart(config, {height: '400', width: '400'});
    const dataURL = bs.canvas((ctx) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(taxRate, taxRate);
      ctx.stroke();
    }, {height: 300, width: 300});
    const colorSelected = bs.colorPicker("Pick a color!");
    const webcam = bs.webcam();
    if (webcam) {
      bs.image(webcam);
    }
    bs.text("Color selected " + colorSelected);
    bs.downloadButton("Download", "image.png", dataURL);
    if (value && taxRate) {
      bs.text(`## Your tax is: $${value * taxRate / 100}!`);
    }
    const response = await api.get("https://www.mockachino.com/e065c9e2-cd3f-4a/users");
    bs.text(`Data: ${JSON.stringify(response.data)}`);
    const checked = bs.checkbox("I don't want to pay taxes")
    bs.text(`You are checked: **${checked}**`);
    const clicked = bs.button("Submit");
    if (clicked) {
      bs.text('Submitted! ');
    }
    bs.code(`
      var a = 1;
      var b = 2;
      console.log(a + b);
      ${checked && 'console.log(a, b);'}
    `, {language: 'javascript'})
    bs.image("https://i.imgur.com/CAcnA3e.jpeg", {width: '100', height: '100'});
    bs.video("/examples/video.mp4", {width: '400', height: '300'});
    bs.audio("http://ringelkater.de/Sounds/2geraeusche_tiere/dino_tyrannosaurus1.wav");
    data.datasets[0].data[0] = parseInt(taxRate);
  }
  bs.start(code);
  _bs = bs;
}
export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined" && _bs === null) {
      initialize();
    }
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Browser Script</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <div id="main-view">
        </div>
      </main>
      <footer>
      </footer>
    </div>
  )
}
