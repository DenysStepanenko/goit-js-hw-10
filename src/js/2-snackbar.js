import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Элементы DOM
const form = document.querySelector(".form");

// Настройки для iziToast
iziToast.settings({
    position: "topRight",
    icon: true, // Включаем иконки
    title: "", // Убираем заголовок
    timeout: 5000, // Уведомление исчезает через 5 секунд
});

// Обработчик отправки формы
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const delay = Number(form.elements.delay.value);
    const state = form.elements.state.value;

    // Создаем промис с указанной задержкой
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });

    // Обрабатываем промис
    promise
        .then((delay) => {
            iziToast.success({
                message: `✔ Fulfilled promise in ${delay}ms`,
                backgroundColor: "#59a96a", // Зеленый фон, как на скриншоте
            });
        })
        .catch((delay) => {
            iziToast.error({
                message: `✖ Rejected promise in ${delay}ms`,
                backgroundColor: "#d1495b", // Красный фон, как на скриншоте
            });
        });
});