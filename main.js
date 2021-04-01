let myDate = new Date();
let dayOfDate = myDate.getDate() + 1;
const todaysDate1 = document.querySelector(".date h1");
const todaysDate = document.querySelector(".date p");
todaysDate.textContent = myDate.toLocaleDateString();
const calendarDays = document.querySelector(".days");
const buttons = [...document.querySelectorAll(".month i")];
let events = localStorage.getItem("events") ? JSON.parse(localStorage.getItem('events')) : [];
const newEvent = document.getElementById('newEventModal');
const deletEvent = document.getElementById('deleteidea');
const saveButton = document.getElementById("save");
const deleteButton = document.getElementById("delete");
const inputValue = document.getElementById("eventTitleInput");
const closeButton = document.getElementById("closeButton");
const removeButton = document.getElementById("deleteButton");

let currentMonth = 0;
let clicked = null;
const weekDays = ["sobota", "niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek"];


class Currentdate {
    constructor() {
        this.date = new Date();
        if (currentMonth !== 0) {
            this.date.setMonth(new Date().getMonth() + currentMonth);
        }
        this.day = this.date.getDay();
        this.month = this.date.getMonth();
        this.year = this.date.getFullYear();
        this.currentMonth = this.date.toLocaleString('pl-PL', { // current month
            month: "long"
        });
        this.firstDayOfTheMonth = new Date(this.year, this.month, 1).toLocaleDateString("pl-PL", { // first day of the month
            weekday: "long"
        })
        this.daysInMonths = new Date(this.year, this.month + 1, 0).getDate(); // number of days in month
        this.daysInWeekDays = weekDays.indexOf(this.firstDayOfTheMonth);
        this.currentDayGreen = dayOfDate;
    }
    createDays() {
        calendarDays.innerHTML = "";
        todaysDate1.textContent = "";
        todaysDate1.textContent = this.currentMonth + " " + this.year;
        for (let i = 1; i <= this.daysInMonths + this.daysInWeekDays; i++) {
            const calendarDay = document.createElement("div");
            const dayString = `${this.month + 1}/${i - this.daysInWeekDays}/${this.year}`;
            if (i > this.daysInWeekDays) {
                calendarDay.innerText = i - this.daysInWeekDays;
                const eventForDay = events.find(e => e.date == dayString);
                let query = window.matchMedia("(max-width: 500px)");
                let query2 = window.matchMedia("(max-width: 812px)", "(orientation: landscape)")
                if (eventForDay) {
                    if (!query.matches && !query2.matches) {
                        const newDiv = document.createElement("div");
                        newDiv.classList.add("event");
                        newDiv.innerText = eventForDay.title;
                        calendarDay.appendChild(newDiv)
                    } else if (query.matches || query2.matches) {
                        const newDiv = document.createElement("div");
                        newDiv.classList.add("event");
                        newDiv.innerText = "1";
                        calendarDay.appendChild(newDiv)
                    }
                }
                calendarDay.addEventListener("click", () => this.addNewEvent(dayString))
            } else {
                calendarDay.classList.add("changeColor")
            }
            calendarDays.appendChild(calendarDay);
        }
    }

    addNewEvent(date) {
        clicked = date;
        const eventForDay = events.find(e => e.date == date);

        if (eventForDay) {
            document.getElementById("eventtext").innerText = eventForDay.title;
            deletEvent.style.display = "flex";
        } else {
            newEvent.style.display = "flex";

        }

    }

    // close the new event window

    deleteEvent() {
        newEvent.style.display = "none";
        inputValue.classList.remove("error");
        deletEvent.style.display = "none";
        inputValue.value = "";
        clicked = null;
        this.createDays();
    }

    //if i want to add event

    saveEvent() {
        if (inputValue.value) {
            inputValue.classList.remove("error");
            events.push({
                date: clicked,
                title: inputValue.value,
            })
            localStorage.setItem('events', JSON.stringify(events));
            this.deleteEvent();

        } else {
            inputValue.classList.add("error")
        }
    }

    // remove event from already existited
    removeEvent() {
        events = events.filter(e => e.date !== clicked);
        localStorage.setItem("events", JSON.stringify(events));
        this.deleteEvent();
    }

}

// start whole calendar
class Start {
    constructor() {
        this.date = new Currentdate();
        this.date.createDays();

        buttons[0].addEventListener("click", () => {
            currentMonth--;
            this.date = new Currentdate();
            this.date.createDays();
        })
        buttons[1].addEventListener("click", () => {
            currentMonth++;
            this.date = new Currentdate();
            this.date.createDays();
        })
        deleteButton.addEventListener("click", () => {
            this.date.deleteEvent();
        });
        saveButton.addEventListener("click", () => {
            this.date.saveEvent();
        });
        closeButton.addEventListener("click", () => {
            this.date.deleteEvent();
        });
        removeButton.addEventListener("click", () => {
            this.date.removeEvent();
        });
    }
}
const start = new Start();