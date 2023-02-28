/* eslint-disable strict */
/* jshint browser: true, esversion: 6, asi: true */
/* globals uibuilder */
// @ts-nocheck

/** Minimalist code for uibuilder and Node-RED */
'use strict'

// run this function when the document is loaded
window.onload = function() {
    // Start up uibuilder - see the docs for the optional parameters
    uibuilder.start()

    uibuilder.send({
        'topic': 'refresh',
        'payload': 'refresh',
    })

    // Listen for incoming messages from Node-RED
    uibuilder.onChange('msg', function(msg){
        if(msg.topic == 'main_count') {
            updateCount(msg, 'main_count_')
        } else if(msg.topic == 'tool_timer') {
            updateTimer(msg, 'tt_')
        } else if(msg.topic == 'machine_timer') {
            updateTimer(msg, 'mt_')
        } else if(msg.topic == 'step_timer') {
            updateTimer(msg, 'st_')
        } else if(msg.topic == 'reject_count') {
            updateCount(msg, 'reject_count_')
        }
    })
}

const updateCount = (msg, count_pre) => {
    Object.keys(msg.counts).forEach(sectionName => {
        let count_element = document.getElementById(count_pre + sectionName.replace('section', ''))
        count_element.innerText = msg.counts[sectionName]
        // console.log(msg.counts[sectionName]);
    });
}

const updateTimer = (msg, timer_pre) => {
    msg.timers.forEach((timer, index)=> {
        let sectionNo = index<9?'0'+(index+1):'10'
            let timer_start = document.getElementById(timer_pre + sectionNo + '_start')
            let timer_end = document.getElementById(timer_pre + sectionNo + '_end')
            let timer_duration = document.getElementById(timer_pre + sectionNo + '_duration')
            let start = timer.start_time
            let end = timer.end_time
            let duration = timer.duration
            timer_start.innerText = start?start:''
            timer_end.innerText = end?end:''
            timer_duration.innerText = duration=='00:00:00'?'':duration

            changeColor(timer, timer_start.parentElement)
    })
}

const changeColor = (timer, notElement) => {
    let status = timer.start_time?timer.end_time?'is-success':'is-danger':'is-link'
    if(notElement.classList.contains("is-success")) {
        notElement.classList.remove("is-success")
    } else if(notElement.classList.contains("is-danger")) {
        notElement.classList.remove("is-danger")
    } if(notElement.classList.contains("is-link")) {
        notElement.classList.remove("is-link")
    }

    notElement.classList.add(status)
}

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const site = urlParams.get('site')  // 'abc'