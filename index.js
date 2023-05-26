const express = require('express');
const app = express();
const Chart = require('chart.js/auto');
const PDFDocument = require('pdfkit');
const { createCanvas } = require('canvas');
const nodemailer = require('nodemailer');
const fs = require('fs');

const pdfFile = `user-stepcount-report.pdf`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req, res) => {

  try {

    const emailId = req.body.EmailId;
    const stepsCount = req.body.StepsCount || [];

    // Vaildation For EmailID
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailPattern.test(emailId)) {
      res.status(400).send('Invaild Email Id');
      return;
    }

    // Vaildation For StepsCount
    if (!stepsCount || stepsCount.length == 0) {
      res.status(400).send('Invaild StepCount Data');
      return;
    }

    // Generate chart label data (ex: ["day1","day2","day3"])
    const days = stepsCount?.reduce((list, item) => {
      return list.concat(...Object.keys(item))
    }, []);

    // Generate chart Graph data (ex: ["1000","2000","3000"])
    const steps = stepsCount?.reduce((list, item) => {
      return list.concat(...Object.values(item))
    }, [])

    // Create canvas and chart
    const graphData = {
      labels: days,
      datasets: [{
        label: 'User StepCounts',
        data: steps,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    };
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: graphData,
      options: {
        scales: {
          x: { title: { display: true, text: 'Days' } },
          y: { title: { display: true, text: 'Steps' } }
        }
      }
    });

    // Create PDF document
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfFile));

    // Add chart to PDF document
    const chartImage = canvas.toBuffer('image/png');
    doc.image(chartImage, 50, 50, { width: 400 });

    // Save PDF document
    doc.end();

    // Send PDF File to Mail 
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '',
        pass: ''
      }
    });

    const mailOptions = {
      from: '',
      to: emailId,
      subject: 'Step Counts Report',
      text: 'Please find the chart PDF attached.',
      attachments: [
        {
          filename: pdfFile,
          path: `./${pdfFile}`
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    // Send response
    res.status(200).send('Mail Sent Successfully');

  } catch (err) {

    res.status(500).send(`Something Went Wrong`);

  }
});

app.listen(8081, () => {
  console.log('Server started on port 8081');
});

module.exports = app;
