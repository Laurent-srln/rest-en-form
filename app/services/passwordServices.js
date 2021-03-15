const nodemailer = require("nodemailer");
const { getMaxListeners } = require("process");


const passwordServices = {

passwordMail: async (token, email) => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'restenforme.gerant@gmail.com',
          pass: '5Octobre2020'
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
  });

  // send mail with defined transport object
    await transporter.sendMail({
      from: '"Le gérant de votre salle de sport" <restenforme.gerant@gmail.com>', // sender address
      to: "user.restenforme@gmail.com", // list of receivers
      subject: "Finalisez votre inscription à notre application de suivi !", // Subject line
      text: "https://app-osport.herokuapp.com/login", // plain text body
      html: `<a href="https://app-osport.herokuapp.com/register?token=${token}"a>Cliquez ici pour configurer votre mot de passe</a>`, // html body
  });

  console.log(`Mail envoyé à ${email}`);
},

newPasswordMail: async (token, email) => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'restenforme.gerant@gmail.com',
          pass: '5Octobre2020'
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
  });

  // send mail with defined transport object
    await transporter.sendMail({
      from: '"Le gérant de votre salle de sport" <restenforme.gerant@gmail.com>', // sender address
      to: "user.restenforme@gmail.com", // list of receivers
      subject: "Réinitialisez votre mot de passe.", // Subject line
      text: "https://app-osport.herokuapp.com/login", // plain text body
      html: `<a href="https://app-osport.herokuapp.com/register?token=${token}"a>Cliquez ici pour configurer votre mot de passe</a>`, // html body
  });

  console.log(`Mail envoyé à ${email}`);
}



}

module.exports = passwordServices;