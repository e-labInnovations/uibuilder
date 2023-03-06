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

    // Listen for incoming messages from Node-RED
    uibuilder.onChange('msg', function (msg) {
        // console.log(msg);
        if (msg.topic == 'settings_feedback') {
            if (msg.isSuccess) {
                bulmaToast.toast({ message: msg.msg, type: 'is-success' })
                closeModal()
            } else {
                bulmaToast.toast({ message: msg.msg, type: 'is-danger' })
            }
        }
    })

    //Clear all button
    document.getElementById('btnClearAll').addEventListener('click', () => {
        openModal('Warning!', 'It clears all your data including all counters and timers status & histories<br>Enter password and proceed', 'clearAll')
    })

    /******************************COUNTERS******************************/
    // Reset all counters button
    document.getElementById('btnResetAllCounters').addEventListener('click', () => {
        openModal('Warning!', 'It resets all counters (both main and reject counters resets to 0)<br>Enter password and proceed', 'resetAllCounters')
    })

    // Reset selected counters button
    document.getElementById('btnResetSelectedCounter').addEventListener('click', () => {
        openModal('Warning!', 'It resets selected counters (both main and reject counters resets to 0)<br>Enter password and proceed', 'resetSelectedCounter')
    })

    /******************************TIMERS******************************/
    // Clear all timers button
    document.getElementById('btnClearAllTimers').addEventListener('click', () => {
        openModal('Warning!', 'It clears all the timers status and history. (Stop all running timers)<br>Enter password and proceed', 'clearAllTimers')
    })

    // Clear selected timers button
    document.getElementById('btnClearSelectedTimers').addEventListener('click', () => {
        openModal('Warning!', 'It clears all the selected timers status and history. (Stop all running selected timers)<br>Enter password and proceed', 'clearSelectedTimers')
    })

    // Clear all timers status button
    document.getElementById('btnClearStatusAllTimers').addEventListener('click', () => {
        openModal('Warning!', 'It clears status of all the timers. (Stop all running timers)<br>Enter password and proceed', 'clearStatusAllTimers')
    })

    // Clear slected timers status button
    document.getElementById('btnClearStatusSelectedTimers').addEventListener('click', () => {
        openModal('Warning!', 'It clears status of all selected timers. (Stop all running timers selected)<br>Enter password and proceed', 'clearStatusSelectedTimers')
    })

    // Clear all timers history button
    document.getElementById('btnClearHistoryAllTimers').addEventListener('click', () => {
        openModal('Warning!', 'It clears the history of all timers.<br>Enter password and proceed', 'clearHistoryAllTimers')
    })

    // Clear slected timers istory button
    document.getElementById('btnClearHistorySelectedTimers').addEventListener('click', () => {
        openModal('Warning!', 'It clears history of all selected timers.<br>Enter password and proceed', 'clearHistorySelectedTimers')
    })

    //Clear btn click
    document.getElementById('modalConfirmBtn').addEventListener('click', () => {
        let option = document.getElementById('modalOption').value
        let password = document.getElementById('password').value
        if (!password) {
            bulmaToast.toast({ message: 'Password is empty', type: 'is-danger' })
        } else {
            let data = null
            switch (option) {
                case 'clearAll':
                    sendSettingsRequest({ type: 'ClearAll' }, password)
                    break;
                case 'resetAllCounters':
                    data = {
                        type: 'resetCounters',
                        counters: {
                            main_count: [true, true, true, true, true, true, true, true, true, true],
                            reject_count: [true, true, true, true, true, true, true, true, true, true]
                        }
                    }
                    sendSettingsRequest(data, password)
                    break;
                case 'resetSelectedCounter':
                    data = {
                        type: 'resetCounters',
                        counters: getSelectCounterStatus()
                    }
                    sendSettingsRequest(data, password)
                    break;
                case 'clearAllTimers':
                    data = {
                        type: 'clearTimers',
                        status: true,
                        history: true,
                        timers: {
                            "tool_timer": [true, true, true, true, true, true, true, true, true, true],
                            "machine_timer": [true, true, true, true, true, true, true, true, true, true],
                            "step_timer": [true, true, true, true, true, true, true, true, true, true]
                        }
                    }
                    sendSettingsRequest(data, password)
                    break;
                case 'clearStatusAllTimers':
                    data = {
                        type: 'clearTimers',
                        status: true,
                        history: false,
                        timers: {
                            "tool_timer": [true, true, true, true, true, true, true, true, true, true],
                            "machine_timer": [true, true, true, true, true, true, true, true, true, true],
                            "step_timer": [true, true, true, true, true, true, true, true, true, true]
                        }
                    }
                    sendSettingsRequest(data, password)
                    break;
                case 'clearHistoryAllTimers':
                    data = {
                        type: 'clearTimers',
                        status: false,
                        history: true,
                        timers: {
                            "tool_timer": [true, true, true, true, true, true, true, true, true, true],
                            "machine_timer": [true, true, true, true, true, true, true, true, true, true],
                            "step_timer": [true, true, true, true, true, true, true, true, true, true]
                        }
                    }
                    sendSettingsRequest(data, password)
                    break;
                case 'clearSelectedTimers':
                    data = {
                        type: 'clearTimers',
                        status: true,
                        history: true,
                        timers: getSelectTimersStatus()
                    }
                    sendSettingsRequest(data, password)
                    break;
                case 'clearStatusSelectedTimers':
                    data = {
                        type: 'clearTimers',
                        status: true,
                        history: false,
                        timers: getSelectTimersStatus()
                    }
                    sendSettingsRequest(data, password)
                    break;
                case 'clearHistorySelectedTimers':
                    data = {
                        type: 'clearTimers',
                        status: false,
                        history: true,
                        timers: getSelectTimersStatus()
                    }
                    sendSettingsRequest(data, password)
                    break;

                default:
                    bulmaToast.toast({ message: 'Invalid attempt', type: 'is-warning' })
                    break;
            }
        }
    })
}

const sendSettingsRequest = (data, password) => {
    uibuilder.send({
        'topic': 'settings_action',
        'payload': { data, password },
    })
}


function openModal(title, message, command) {
    document.getElementById('modalTitle').innerText = title
    document.getElementById('modalContent').innerHTML = `
${message}
<div class="control">
    <input class="input" type="password" name="password" placeholder="Password" id="password">
</div>
<input id="modalOption" type="hidden" value="${command}">
`
    document.getElementById('modal').classList.add('is-active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('is-active');
}


function selectAll(className, checkbox) {
    var checkboxes = document.getElementsByClassName(className);
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = checkbox.checked;
    }
}

function selectAllInRow(checkbox) {
    var checkboxes = checkbox.parentNode.parentNode.parentNode.getElementsByTagName("input");
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == "checkbox") {
            checkboxes[i].checked = checkbox.checked;
        }
    }
}

function selectAllRows(checkbox) {
    var rows = checkbox.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var checkboxes = rows[i].getElementsByTagName("input");
        for (var j = 0; j < checkboxes.length; j++) {
            if (checkboxes[j].type == "checkbox") {
                checkboxes[j].checked = checkbox.checked;
            }
        }
    }

    var lastrow = checkbox.parentNode.parentNode.parentNode
    var checkboxes = lastrow.getElementsByTagName("input");
    for (var j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].type == "checkbox") {
            checkboxes[j].checked = checkbox.checked;
        }
    }
}

function getSelectCounterStatus() {
    const mainCheckboxes = document.querySelectorAll('.main-count');
    const rejectCheckboxes = document.querySelectorAll('.reject-count');
    const mainCount = [];
    const rejectCount = [];

    mainCheckboxes.forEach(checkbox => {
        mainCount.push(checkbox.checked);
    });

    rejectCheckboxes.forEach(checkbox => {
        rejectCount.push(checkbox.checked);
    });

    return {
        main_count: mainCount,
        reject_count: rejectCount
    }
}

function getSelectTimersStatus() {
    const toolCheckboxes = document.querySelectorAll('.tool-timer');
    const machineCheckboxes = document.querySelectorAll('.machine-timer');
    const stepCheckboxes = document.querySelectorAll('.step-timer');
    const toolTimers = [];
    const machineTimers = [];
    const stepTimers = [];

    toolCheckboxes.forEach(checkbox => {
        toolTimers.push(checkbox.checked);
    });
    machineCheckboxes.forEach(checkbox => {
        machineTimers.push(checkbox.checked);
    });
    stepCheckboxes.forEach(checkbox => {
        stepTimers.push(checkbox.checked);
    });

    return {
        tool_timer: toolTimers,
        machine_timer: machineTimers,
        step_timer: stepTimers
    }
}
