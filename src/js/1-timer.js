import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Элементы DOM
const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysDisplay = document.querySelector("[data-days]");
const hoursDisplay = document.querySelector("[data-hours]");
const minutesDisplay = document.querySelector("[data-minutes]");
const secondsDisplay = document.querySelector("[data-seconds]");

// Переменная для хранения выбранной даты
let userSelectedDate = null;
let timerInterval = null;

// Опции для flatpickr
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        const now = new Date();

        if (selectedDate <= now) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
                position: "topRight",
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startButton.disabled = false;
        }
    },
};

// Инициализация flatpickr
flatpickr(datetimePicker, options);

// Функция для форматирования времени
function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

// Функция для конвертации миллисекунд в дни, часы, минуты, секунды
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

// Функция для обновления интерфейса таймера
function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysDisplay.textContent = addLeadingZero(days);
    hoursDisplay.textContent = addLeadingZero(hours);
    minutesDisplay.textContent = addLeadingZero(minutes);
    secondsDisplay.textContent = addLeadingZero(seconds);
}

// Функция для запуска таймера
function startTimer() {
    if (!userSelectedDate) return;

    // Деактивируем кнопку и инпут
    startButton.disabled = true;
    datetimePicker.disabled = true;

    timerInterval = setInterval(() => {
        const now = new Date();
        const timeRemaining = userSelectedDate - now;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            datetimePicker.disabled = false; // Активируем инпут после завершения
            return;
        }

        const time = convertMs(timeRemaining);
        updateTimerDisplay(time);
    }, 1000);
}

// Добавляем обработчик события на кнопку Start
startButton.addEventListener("click", startTimer);