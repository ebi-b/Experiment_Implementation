
first_color = document.getElementById("btn1").style.backgroundColor;
activated_button_number = 0;
choosen_button_numbers = [];
let response;
let phrases = "";
let currenty_key_text = "";
const candidate_word_number = 15;
let words = []
let freqs = []
let codes = []
let selectwordsphase = false;
let activated_word = "";
let selected_words = []
let presented_text = ""
const phrase_count_limit = 1
let phrase_count = 0
let delay_time = 500
let actions = []
let actions_t = []
const sak_page_url = '/sak'
const level_url = "/sak/diflevel"


async function onload_actions() {
  set_presented_text();
  blinking();
  setting_dif_level(level_url)
  codes = await readDictionary();
  keypress_management();
  //console.log(words)
  //console.log(freqs)
  //console.log(codes);
}



function keypress_management() {
  repeat_number = 0;
  currenty_key_text = ""

  document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
      if (event.repeat)
        repeat_number++;
      //console.log('Space pressed' + event.repeat + repeat_number); //whatever you want to do when space is pressed
    }
  })
  document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
      //console.log('Space released'); //whatever you want to do when space is pressed
      //long press is set on 1 for now
      if (repeat_number > 0) {
        actions.push("clearing")
        actions_t.push(Date.now())
        choosen_button_numbers = [];
        let is_currenty_key_empty = update_currenty_key(true);
        update_candidate_words(true);
        if (is_currenty_key_empty) update_transcribed_text(true);
        selectwordsphase = false
      }
      if (repeat_number == 0 && !selectwordsphase) {
        if (activated_button_number == 3) {
          actions.push(3)
          actions_t.push(Date.now())
          if (choosen_button_numbers.length > 0) {
            selectwordsphase = true;
            console.log("word select is activated");
          }
        } else {
          actions.push(activated_button_number)
          actions_t.push(Date.now())
          choosen_button_numbers.push(activated_button_number);
          update_currenty_key(false);
          update_candidate_words(false);
        }
      } else if (repeat_number == 0 && selectwordsphase) {
        console.log("in selecting mode")
        update_transcribed_text(false)
        choosen_button_numbers = [];
      }

      repeat_number = 0
      //console.log("repeat number is updated" + repeat_number)
      console.log(choosen_button_numbers)
    }
    else {
      actions.push(event.code)
      actions_t.push(Date.now())
    }
  })
}

async function blinking() {
  document.getElementById("btn1").style.backgroundColor = first_color
  document.getElementById("btn2").style.backgroundColor = first_color
  document.getElementById("btn3").style.backgroundColor = first_color
  document.getElementById("btn4").style.backgroundColor = first_color

  candididate_words_in_box = [];
  while (!selectwordsphase) {
    activated_button_number = 0;
    document.getElementById("btn1").style.backgroundColor = 'red'
    await delay(delay_time);
    activated_button_number = 1;
    document.getElementById("btn1").style.backgroundColor = first_color
    document.getElementById("btn2").style.backgroundColor = 'red'
    await delay(delay_time);
    activated_button_number = 2;
    document.getElementById("btn2").style.backgroundColor = first_color
    document.getElementById("btn3").style.backgroundColor = 'red'
    await delay(delay_time);
    activated_button_number = 3;
    document.getElementById("btn3").style.backgroundColor = first_color
    document.getElementById("btn4").style.backgroundColor = 'red'
    await delay(delay_time);
    document.getElementById("btn4").style.backgroundColor = first_color
  }
  if (selectwordsphase) {
    document.getElementById("btn4").style.backgroundColor = 'red';
    document.getElementById("btn1").style.backgroundColor = first_color;
    document.getElementById("btn2").style.backgroundColor = first_color;
    document.getElementById("btn3").style.backgroundColor = first_color;
    wordButtonsDiv = document.getElementById("sak_candidate_buttons");
    wordButtons = wordButtonsDiv.getElementsByClassName("sakBtn2");
    //console.log(wordButtons[0]);
    for (bi = 0; bi < wordButtons.length; bi++) {
      candididate_words_in_box.push(wordButtons[bi].id)
      //onsole.log("HERE "+bi+"--"+ wordButtons[bi].id)
    }
    //console.log(candididate_words_in_box)
  }

  while (selectwordsphase) {
    for (ij = 0; ij < candididate_words_in_box.length; ij++) {
      //console.log(ij);
      activated_word = candididate_words_in_box[ij];
      if (selectwordsphase) {
        if (document.getElementById(candididate_words_in_box[ij])) {
          document.getElementById(candididate_words_in_box[ij]).style.backgroundColor = 'red'
          await delay(delay_time);
        }
      }
      if (selectwordsphase)
        if (document.getElementById(candididate_words_in_box[ij]))
          document.getElementById(candididate_words_in_box[ij]).style.backgroundColor = first_color
    }
  }
  blinking()


}

async function readTextFile() {
  response = fetch("/files/phrases2.txt").then(response => { return response.text() })
  // parse_file_to_text()
  try {
    const value = await response;
    phrases = value
    var lines = phrases.split("\n")
    //presenting a transcribed text
    random_number = Math.floor(Math.random() * (lines.length - 1))
    document.getElementById("sak_presented_text").value = lines[random_number]
    presented_text = lines[random_number];
    actions.push(presented_text)
    actions_t.push(Date.now())


  } catch (err) {
    console.log(err); // 👉️ "Something went wrong"
  }
}


function set_presented_text() {
  readTextFile()

}


async function readDictionary() {
  var codes = [];
  //var freqs = [];
  response = fetch("/files/dictionary.txt").then(response => { return response.text() })
  // parse_file_to_text()
  try {
    const value = await response;
    phrases = value
    var lines = phrases.split("\n")
    wordnumber = 0
    for (i = 0; i < lines.length; i++) {

      wf = lines[i].split(" ");
      word = wf[0]
      freq = parseInt(wf[1])

      if (word === "")
        console.log("BLANK In Dictionary")
      else {
        // console.log("word= " + word + " Freq= " + freq)

        words.push(word);
        freqs.push(freq);
        codes[wordnumber] = word_code(word);
        wordnumber++;
      }
    }
    //console.log(words)
    //console.log(codes)
    //console.log(freqs)

  } catch (err) {
    console.log(err); // 👉️ "Something went wrong"
  }
  //return words,freqs
  return codes
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function word_code(word) {
  lst = word.split("")
  //console.log(lst);
  code = []
  for (ii in lst) {
    l = lst[ii];
    // console.log(l)
    if (l == 'a' || l == 'b' || l == 'c' || l == 'd' || l == 'e' || l == 'f' || l == 'g' || l == 'h') {
      // console.log("here1")
      code.push(0)
    }

    if (l === 'i' || l === 'j' || l === 'k' || l === 'l' || l === 'm' || l === 'n' || l === 'o' || l === 'p') {
      // console.log("here2")
      code.push(1)
    }

    if (l === 'q' || l === 'r' || l === 's' || l === 't' || l === 'u' || l === 'v' || l === 'w' || l === 'x' || l === 'y' || l === 'z') {
      // console.log("here3")
      code.push(2)
    }


  }
  //console.log(code)
  return code
}
function update_currenty_key(IsClearing) {
  //await activated_button_number
  //console.log(activated_button_number)
  tmp = activated_button_number + 1
  currenty_key_text += tmp
  if (IsClearing) {
    currenty_key_text = ''

    if (document.getElementById("sak_currenty_keys").value == "")
      return true
    else {
      document.getElementById("sak_currenty_keys").value = currenty_key_text;
      return false
    }
  }
  else {
    document.getElementById("sak_currenty_keys").value = currenty_key_text;
    return false
  }


}

function update_candidate_words(isClearing) {
  var candidate_count = 0;
  let candidate_temp_words = [];
  let candidate_temp_words_freq = [];
  document.getElementById("sak_candidate_buttons").innerHTML = "";
  //appendButton("Please");

  if (!isClearing) {
    endofdic = false
    isEnough = false
    while ((!endofdic) && (!isEnough)) {
      candidate_count = 0;
      for (dicindex = 0; dicindex < freqs.length && !isEnough; dicindex++) {
        if (isACandidate(codes[dicindex], 1)) {
          candidate_count++
          candidate_temp_words.push(words[dicindex])
          candidate_temp_words_freq.push(freqs[dicindex])
        }
      }

      if (candidate_count < candidate_word_number) {
        for (dicindex = 0; dicindex < freqs.length && !isEnough; dicindex++) {
          if (isACandidate(codes[dicindex], 0) && !isACandidate(codes[dicindex], 1)) {
            candidate_count++
            candidate_temp_words.push(words[dicindex])
            candidate_temp_words_freq.push(freqs[dicindex])
            if (candidate_count >= candidate_word_number)
              isEnough = true
          }
        }
      }

      if (candidate_temp_words)
        for (t = 0; t < candidate_temp_words_freq.length; t++) {
          let maxIndex = candidate_temp_words_freq.indexOf(Math.max(...candidate_temp_words_freq));
          appendButton(candidate_temp_words[maxIndex])
          candidate_temp_words_freq[maxIndex] = -1;

        }

      // if (candidate_count >= candidate_word_number) {
      //   // isEnough = true;
      //   if (isACandidate(codes[dicindex], 1)) {
      //     candidate_count++
      //     candidate_temp_words.push(words[dicindex])
      //     candidate_temp_words_freq.push(freqs[dicindex])
      //     //appendButton(words[dicindex]);
      //   }

      // }
      // if (candidate_count < candidate_word_number) {
      //   if (isACandidate(codes[dicindex], 0)) {
      //     candidate_count++
      //     candidate_temp_words.push(words[dicindex])
      //     candidate_temp_words_freq.push(freqs[dicindex])
      //    // appendButton(words[dicindex])
      //   }
      // }


      endofdic = true;
    }



    if (candidate_count == 0) {
      update_currenty_key(true)
      choosen_button_numbers = []

    }
  }
}


async function update_transcribed_text(isClearing) {

  if (isClearing && selected_words.length != 0) {
    //console.log("in update transcribed text");
    actions.push('clearing')
    actions_t.push(Date.now())
    selected_words.pop();
    await selected_words;
    present_transcribed_text();
  }
  else if (!isClearing) {
    actions.push(activated_word)
    actions_t.push(Date.now())
    selected_words.push(activated_word);
    selectwordsphase = false;
    present_transcribed_text();
    update_currenty_key(true);
    update_candidate_words(true);


  }
}
function present_transcribed_text() {

  console.log("in present tr text--  " + selected_words);
  let str = "";
  if (selected_words.length > 0) {
    str = selected_words[0]
    for (i = 1; i < selected_words.length; i++) {
      str = str + " " + selected_words[i];
    }
  }
  let presented_text_array = presented_text.split(" ")
  document.getElementById("sak_transcribed_text").value = str;
  // console.log("---" + str + "----")
  // console.log(typeof (str))
  // console.log(typeof (presented_text))
  // console.log("---" + presented_text_array + "----")
  // console.log(String(presented_text.replace(/\s+/g, "")) ===
  //   String(str.replace(/\s+/g, "")))
  // if (selected_words.length == presented_text_array.length) {
  //   console.log("length are equal")
  //   for(ii =0; ii<selected_words.length;ii++)
  //   {
  //     if(selected_words[ii]==presented_text_array[ii])
  //     console.log("TE"+ii)
  //     else
  //     console.log(`----${selected_words[ii]}-----${presented_text_array[ii]}----`)
  //   }

  if (String(presented_text.replace(/\s+/g, "")) ===
    String(str.replace(/\s+/g, ""))) {
    console.log("Equal")
    phrase_count++;

    if (phrase_count < phrase_count_limit) {
      selected_words = [];
      present_transcribed_text();
      set_presented_text();
    }
    else {
      end_sakeExpriment()
    }
  }
}

function isACandidate(code, mode) {
  if (choosen_button_numbers.length > code.length) { return false } else {
    for (i = 0; i < choosen_button_numbers.length; i++) {
      if (choosen_button_numbers[i] != code[i])
        return false
    }
    if (mode == 0)
      return true
    else if (mode == 1) {
      if (choosen_button_numbers.length == code.length) return true;
      else return false;
    }

  }
}

function appendButton(button_text) {

  html_text = document.getElementById("sak_candidate_buttons").innerHTML
  button_text = '<div><button id=' + button_text + " " + 'type="submit" class="sakBtn2" onClick="return false;">' + button_text + '</button></div>\n'
  new_html_text = html_text + button_text;
  document.getElementById("sak_candidate_buttons").innerHTML = new_html_text
  //<div><button id="btn1" type="submit" class="sakBtn2" onClick="return false;">ABCDEFGH</button></div>
}

function end_sakeExpriment() {
  const data = {
    "actions": actions,
    "timestamps": actions_t
  }
  fetch(sak_page_url, {
    method: 'POST', // or 'PUT'
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    }
    )
    .catch((error) => {
      console.error('Error:', error);
    });

}

async function setting_dif_level(url) {
  var N = 1
  const response = await fetch(url);

  // Storing data in form of JSON
  var data = await response.json();
  //data=JSON.stringify(data)
  console.log(data);
  if (response) {
    // hideloader();
    N = data.n

  }
  // var N = window.prompt("Enter difficulty level: ");
  // alert("Difficulty level is " + N);
  if (N)
    delay_time = N

  console.log(`N is ${N} and Delay time is ${delay_time}`)
}