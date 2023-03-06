/* eslint-disable strict */
/* jshint browser: true, esversion: 6, asi: true */
/* globals uibuilder */
// @ts-nocheck

/** Minimalist code for uibuilder and Node-RED */
'use strict'

// run this function when the document is loaded
window.onload = function () {
    // Start up uibuilder - see the docs for the optional parameters
    uibuilder.start()


    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const timer = urlParams.get('timer')
    const section = urlParams.get('section')

    if (timer) {
        uibuilder.send({
            'topic': 'history',
            'payload': {
                timer: timer,
                section: section
            },
        })
    } else {
        document.getElementById('title').innerText = 'Error'
        document.getElementById('subtitle').innerText = 'Not timer found'
    }

    // Listen for incoming messages from Node-RED
    uibuilder.onChange('msg', function (msg) {
        // console.log(msg);
        if (msg.topic == 'history') {
            updateTable(msg)
        } else if (msg.topic == 'clear_feedback') {
            updateClearResult(msg)
        }
    })

    //All clear button
//     document.getElementById('btnAllClear').addEventListener('click', () => {
//         document.getElementById('modalTitle').innerText = 'Warning!'
//         document.getElementById('modalContent').innerHTML =`
// It clears all your data including all histories, counts and timers<br>
// Enter password and continue
// <div class="control">
//     <input class="input" type="password" name="password" placeholder="Password" id="password">
// </div>
// <input id="modalOption" type="hidden" value="all_clear">
// `
//         openModal()
//     })

    //Clear current history button
    // document.getElementById('btnCurrentClear').addEventListener('click', () => {
    //     console.log('Current clear');
    // })

    //Clear btn click
    document.getElementById('modalConfirmBtn').addEventListener('click', () => {
        let option = document.getElementById('modalOption').value
        let password = document.getElementById('password').value
        if (!password) {
            bulmaToast.toast({ message: 'Password is empty', type: 'is-danger' })
        } else {
            if (option == 'all_clear') {
                uibuilder.send({
                    'topic': 'history_clear',
                    'payload': {
                        type: 'all',
                        password: password
                    },
                })
            }
        }
    })
}

const updateTable = (msg) => {
    let table_content = msg.history.map(item => {
        return `<tr>
    <th>${item.section}</th>
    <td>${item.start_time}</td>
    <td>${item.end_time}</td>
    <td>${item.duration}</td>
</tr>
`}).join('')

    document.getElementById('tbody').innerHTML = table_content
    document.getElementById('title').innerText = msg.details.timer
    document.getElementById('subtitle').innerText = msg.details.section
    document.getElementById('total_duration').innerText = msg.details.total_duration
}

const updateClearResult = (msg) => {
    if (msg.isSuccess) {
        bulmaToast.toast({ message: msg.msg, type: 'is-success' })
        closeModal()
        window.location.reload();
    } else {
        bulmaToast.toast({ message: msg.msg, type: 'is-danger' })
    }
}

function openModal() {
    document.getElementById('modal').classList.add('is-active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('is-active');
}