
var axios = require('axios');


exports.translate = async function(text) {

  let key = 'trnsl.1.1.20181213T061454Z.34ecaf0bbab30a88.2ffdf7eea96263393f591f2857006c3ff57972d8';

  let url = `https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-ru&key=${key}&text=${text}`;

  let response = await axios.post(url);

  return response.data.text;

}

function test(){
  exports.translate('sd')
      .then(res => console.log(res));
}



