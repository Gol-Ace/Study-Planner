// @ts-nocheck

"use strict";

/* =====================================================
   STUDY PLANNER
   ===================================================== */


/* =====================================================
   STORAGE
   ===================================================== */

const STORAGE = {
    subjects: "studyPlanner_subjects",
    tasks: "studyPlanner_tasks",
    exams: "studyPlanner_exams",
    activity: "studyPlanner_activity"
};


let subjects = readStorage(STORAGE.subjects);
let tasks = readStorage(STORAGE.tasks);
let exams = readStorage(STORAGE.exams);
let activity = readStorage(STORAGE.activity);

let activeFilter = "all";


function readStorage(key) {

    try {

        const saved =
            localStorage.getItem(key);

        if (!saved) {
            return [];
        }

        const data =
            JSON.parse(saved);

        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        return [];

    }

}


function writeStorage(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


/* =====================================================
   ELEMENTS
   ===================================================== */

const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );

const navLinks =
    document.getElementById(
        "navLinks"
    );

const todayDate =
    document.getElementById(
        "todayDate"
    );

const subjectCount =
    document.getElementById(
        "subjectCount"
    );

const completedTaskCount =
    document.getElementById(
        "completedTaskCount"
    );

const pendingTaskCount =
    document.getElementById(
        "pendingTaskCount"
    );

const examCount =
    document.getElementById(
        "examCount"
    );

const progressPercentage =
    document.getElementById(
        "progressPercentage"
    );

const progressText =
    document.getElementById(
        "progressText"
    );

const progressFill =
    document.getElementById(
        "progressFill"
    );

const subjectGrid =
    document.getElementById(
        "subjectGrid"
    );

const subjectEmptyState =
    document.getElementById(
        "subjectEmptyState"
    );

const taskList =
    document.getElementById(
        "taskList"
    );

const taskEmptyState =
    document.getElementById(
        "taskEmptyState"
    );

const examList =
    document.getElementById(
        "examList"
    );

const examEmptyState =
    document.getElementById(
        "examEmptyState"
    );

const addSubjectButton =
    document.getElementById(
        "addSubjectButton"
    );

const addTaskButton =
    document.getElementById(
        "addTaskButton"
    );

const addExamButton =
    document.getElementById(
        "addExamButton"
    );

const subjectModal =
    document.getElementById(
        "subjectModal"
    );

const taskModal =
    document.getElementById(
        "taskModal"
    );

const examModal =
    document.getElementById(
        "examModal"
    );

const subjectForm =
    document.getElementById(
        "subjectForm"
    );

const taskForm =
    document.getElementById(
        "taskForm"
    );

const examForm =
    document.getElementById(
        "examForm"
    );

const subjectName =
    document.getElementById(
        "subjectName"
    );

const subjectColor =
    document.getElementById(
        "subjectColor"
    );

const taskTitle =
    document.getElementById(
        "taskTitle"
    );

const taskSubject =
    document.getElementById(
        "taskSubject"
    );

const taskDueDate =
    document.getElementById(
        "taskDueDate"
    );

const examName =
    document.getElementById(
        "examName"
    );

const examSubject =
    document.getElementById(
        "examSubject"
    );

const examDate =
    document.getElementById(
        "examDate"
    );


/* =====================================================
   ADVANCED STATISTICS ELEMENTS
   ===================================================== */

const studyStreak =
    document.getElementById(
        "studyStreak"
    );

const streakMessage =
    document.getElementById(
        "streakMessage"
    );

const completionRate =
    document.getElementById(
        "completionRate"
    );

const totalTaskCount =
    document.getElementById(
        "totalTaskCount"
    );

const nextExamDays =
    document.getElementById(
        "nextExamDays"
    );

const nextExamName =
    document.getElementById(
        "nextExamName"
    );

const weeklySummary =
    document.getElementById(
        "weeklySummary"
    );


/* =====================================================
   WEEKLY BAR ELEMENTS
   ===================================================== */

const weeklyBars = {

    1: document.getElementById(
        "mondayBar"
    ),

    2: document.getElementById(
        "tuesdayBar"
    ),

    3: document.getElementById(
        "wednesdayBar"
    ),

    4: document.getElementById(
        "thursdayBar"
    ),

    5: document.getElementById(
        "fridayBar"
    ),

    6: document.getElementById(
        "saturdayBar"
    ),

    0: document.getElementById(
        "sundayBar"
    )

};


/* =====================================================
   ID GENERATOR
   ===================================================== */

function createId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );

}


/* =====================================================
   DATE FUNCTIONS
   ===================================================== */

function getTodayString() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function getDaysUntil(dateString) {

    const today =
        new Date(
            `${getTodayString()}T00:00:00`
        );

    const target =
        new Date(
            `${dateString}T00:00:00`
        );

    const difference =
        target.getTime() -
        today.getTime();

    return Math.round(
        difference / 86400000
    );

}


/* =====================================================
   ACTIVITY TRACKING
   ===================================================== */

function addActivity() {

    const today =
        getTodayString();

    if (!activity.includes(today)) {

        activity.push(today);

        writeStorage(
            STORAGE.activity,
            activity
        );

    }

}


/* =====================================================
   STUDY STREAK
   ===================================================== */

function calculateStreak() {

    if (activity.length === 0) {
        return 0;
    }

    const uniqueDates =
        [...new Set(activity)]
            .sort()
            .reverse();

    const today =
        new Date(
            `${getTodayString()}T00:00:00`
        );

    const latestDate =
        new Date(
            `${uniqueDates[0]}T00:00:00`
        );

    const daysFromToday =
        Math.round(
            (
                today.getTime() -
                latestDate.getTime()
            ) / 86400000
        );

    /*
       If the latest activity is more than
       one day old, the current streak is zero.
    */

    if (daysFromToday > 1) {
        return 0;
    }

    let streak = 1;

    for (
        let i = 1;
        i < uniqueDates.length;
        i++
    ) {

        const current =
            new Date(
                `${uniqueDates[i - 1]}T00:00:00`
            );

        const previous =
            new Date(
                `${uniqueDates[i]}T00:00:00`
            );

        const difference =
            Math.round(
                (
                    current.getTime() -
                    previous.getTime()
                ) / 86400000
            );

        if (difference === 1) {

            streak++;

        } else {

            break;

        }

    }

    return streak;

}


function renderStreak() {

    const streak =
        calculateStreak();

    studyStreak.textContent =
        `${streak} ${streak === 1 ? "day" : "days"}`;


    if (streak === 0) {

        if (activity.length === 0) {

            streakMessage.textContent =
                "Complete a task to start your streak.";

        } else {

            streakMessage.textContent =
                "Complete a task today to restart your streak.";

        }

    } else if (streak === 1) {

        streakMessage.textContent =
            "Great start! Keep it going tomorrow.";

    } else if (streak < 7) {

        streakMessage.textContent =
            "You're building a strong study habit.";

    } else {

        streakMessage.textContent =
            "Amazing consistency! Keep going.";

    }

}


/* =====================================================
   TODAY
   ===================================================== */

function renderToday() {

    const date =
        new Date();

    todayDate.textContent =
        date.toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "numeric",
                month: "short"
            }
        );

}


/* =====================================================
   MOBILE NAVIGATION
   ===================================================== */

mobileMenuButton.addEventListener(
    "click",
    () => {

        const open =
            navLinks.classList.toggle(
                "open"
            );

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(open)
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            open
                ? "Close navigation"
                : "Open navigation"
        );

    }
);


document
    .querySelectorAll(
        "#navLinks a"
    )
    .forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove(
                        "open"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-label",
                        "Open navigation"
                    );

                }
            );

        }
    );


/* =====================================================
   MODALS
   ===================================================== */

function openModal(modal) {

    modal.classList.add(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


function closeModal(modal) {

    modal.classList.remove(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    const anyModalOpen =
        document.querySelector(
            ".modal.show"
        );

    if (!anyModalOpen) {

        document.body.style.overflow =
            "";

    }

}


function closeAllModals() {

    document
        .querySelectorAll(
            ".modal.show"
        )
        .forEach(
            (modal) => {

                closeModal(
                    modal
                );

            }
        );

}


addSubjectButton.addEventListener(
    "click",
    () => {

        subjectForm.reset();

        openModal(
            subjectModal
        );

        setTimeout(
            () => subjectName.focus(),
            100
        );

    }
);


addTaskButton.addEventListener(
    "click",
    () => {

        if (subjects.length === 0) {

            alert(
                "Add a subject before creating a task."
            );

            return;

        }

        taskForm.reset();

        populateSubjectOptions();

        openModal(
            taskModal
        );

        setTimeout(
            () => taskTitle.focus(),
            100
        );

    }
);


addExamButton.addEventListener(
    "click",
    () => {

        if (subjects.length === 0) {

            alert(
                "Add a subject before creating an exam."
            );

            return;

        }

        examForm.reset();

        populateSubjectOptions();

        openModal(
            examModal
        );

        setTimeout(
            () => examName.focus(),
            100
        );

    }
);


document
    .querySelectorAll(
        "[data-close]"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const modalId =
                        button.getAttribute(
                            "data-close"
                        );

                    const modal =
                        document.getElementById(
                            modalId
                        );

                    if (modal) {

                        closeModal(
                            modal
                        );

                    }

                }
            );

        }
    );


document
    .querySelectorAll(
        ".modal"
    )
    .forEach(
        (modal) => {

            modal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target === modal
                    ) {

                        closeModal(
                            modal
                        );

                    }

                }
            );

        }
    );


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeAllModals();

        }

    }
);


/* =====================================================
   SUBJECTS
   ===================================================== */

subjectForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const name =
            subjectName.value.trim();

        const color =
            subjectColor.value;

        if (!name) {
            return;
        }


        const duplicate =
            subjects.some(
                (subject) =>
                    subject.name.toLowerCase() ===
                    name.toLowerCase()
            );


        if (duplicate) {

            alert(
                "A subject with this name already exists."
            );

            subjectName.focus();

            return;

        }


        subjects.push({

            id: createId(),

            name: name,

            color: color

        });


        writeStorage(
            STORAGE.subjects,
            subjects
        );


        subjectForm.reset();

        closeModal(
            subjectModal
        );

        renderAll();

    }
);


function renderSubjects() {

    subjectGrid.innerHTML =
        "";

    subjectCount.textContent =
        subjects.length;


    subjectEmptyState.style.display =
        subjects.length === 0
            ? "block"
            : "none";


    subjects.forEach(
        (subject) => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                `subject-card subject-${subject.color}`;


            const top =
                document.createElement(
                    "div"
                );

            top.className =
                "subject-top";


            const information =
                document.createElement(
                    "div"
                );


            const name =
                document.createElement(
                    "h3"
                );

            name.className =
                "subject-name";

            name.textContent =
                subject.name;


            const relatedTasks =
                tasks.filter(
                    (task) =>
                        task.subjectId ===
                        subject.id
                );


            const completed =
                relatedTasks.filter(
                    (task) =>
                        task.completed
                ).length;


            const taskCount =
                document.createElement(
                    "p"
                );

            taskCount.className =
                "subject-task-count";

            taskCount.textContent =
                `${completed} of ${relatedTasks.length} tasks completed`;


            information.appendChild(
                name
            );

            information.appendChild(
                taskCount
            );


            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.type =
                "button";

            deleteButton.className =
                "delete-button";

            deleteButton.textContent =
                "×";

            deleteButton.setAttribute(
                "aria-label",
                `Delete ${subject.name}`
            );


            deleteButton.addEventListener(
                "click",
                () =>
                    deleteSubject(
                        subject.id
                    )
            );


            top.appendChild(
                information
            );

            top.appendChild(
                deleteButton
            );

            card.appendChild(
                top
            );

            subjectGrid.appendChild(
                card
            );

        }
    );

}


function deleteSubject(subjectId) {

    const subject =
        subjects.find(
            (item) =>
                item.id === subjectId
        );


    if (!subject) {
        return;
    }


    const relatedTasks =
        tasks.some(
            (task) =>
                task.subjectId === subjectId
        );


    const relatedExams =
        exams.some(
            (exam) =>
                exam.subjectId === subjectId
        );


    let message =
        `Delete ${subject.name}?`;


    if (
        relatedTasks ||
        relatedExams
    ) {

        message =
            `Delete ${subject.name}? Its related tasks and exams will also be removed.`;

    }


    if (!confirm(message)) {
        return;
    }


    subjects =
        subjects.filter(
            (item) =>
                item.id !== subjectId
        );


    tasks =
        tasks.filter(
            (task) =>
                task.subjectId !== subjectId
        );


    exams =
        exams.filter(
            (exam) =>
                exam.subjectId !== subjectId
        );


    writeStorage(
        STORAGE.subjects,
        subjects
    );

    writeStorage(
        STORAGE.tasks,
        tasks
    );

    writeStorage(
        STORAGE.exams,
        exams
    );


    renderAll();

}


/* =====================================================
   SUBJECT SELECT OPTIONS
   ===================================================== */

function populateSubjectOptions() {

    taskSubject.innerHTML =
        "";

    examSubject.innerHTML =
        "";


    const taskDefault =
        document.createElement(
            "option"
        );

    taskDefault.value =
        "";

    taskDefault.textContent =
        "Select a subject";

    taskDefault.disabled =
        true;

    taskDefault.selected =
        true;

    taskSubject.appendChild(
        taskDefault
    );


    const examDefault =
        document.createElement(
            "option"
        );

    examDefault.value =
        "";

    examDefault.textContent =
        "Select a subject";

    examDefault.disabled =
        true;

    examDefault.selected =
        true;

    examSubject.appendChild(
        examDefault
    );


    subjects.forEach(
        (subject) => {

            const taskOption =
                document.createElement(
                    "option"
                );

            taskOption.value =
                subject.id;

            taskOption.textContent =
                subject.name;


            const examOption =
                document.createElement(
                    "option"
                );

            examOption.value =
                subject.id;

            examOption.textContent =
                subject.name;


            taskSubject.appendChild(
                taskOption
            );

            examSubject.appendChild(
                examOption
            );

        }
    );

}


/* =====================================================
   TASKS
   ===================================================== */

taskForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const title =
            taskTitle.value.trim();

        const subjectId =
            taskSubject.value;

        const dueDate =
            taskDueDate.value;


        if (
            !title ||
            !subjectId ||
            !dueDate
        ) {

            return;

        }


        tasks.push({

            id: createId(),

            title: title,

            subjectId: subjectId,

            dueDate: dueDate,

            completed: false,

            createdAt:
                new Date().toISOString()

        });


        writeStorage(
            STORAGE.tasks,
            tasks
        );


        taskForm.reset();

        closeModal(
            taskModal
        );

        renderAll();

    }
);


function renderTasks() {

    taskList.innerHTML =
        "";


    let visibleTasks =
        [...tasks];


    if (
        activeFilter ===
        "pending"
    ) {

        visibleTasks =
            visibleTasks.filter(
                (task) =>
                    !task.completed
            );

    }


    if (
        activeFilter ===
        "completed"
    ) {

        visibleTasks =
            visibleTasks.filter(
                (task) =>
                    task.completed
            );

    }


    visibleTasks.sort(
        (a, b) =>
            a.dueDate.localeCompare(
                b.dueDate
            )
    );


    taskEmptyState.style.display =
        visibleTasks.length === 0
            ? "block"
            : "none";


    visibleTasks.forEach(
        (task) => {

            const item =
                document.createElement(
                    "article"
                );

            item.className =
                "task-item";


            if (task.completed) {

                item.classList.add(
                    "completed"
                );

            }


            const check =
                document.createElement(
                    "button"
                );

            check.type =
                "button";

            check.className =
                "task-check";


            if (task.completed) {

                check.classList.add(
                    "completed"
                );

                check.textContent =
                    "✓";

            }


            check.setAttribute(
                "aria-label",
                task.completed
                    ? "Mark task as pending"
                    : "Mark task as completed"
            );


            check.addEventListener(
                "click",
                () =>
                    toggleTask(
                        task.id
                    )
            );


            const details =
                document.createElement(
                    "div"
                );

            details.className =
                "task-details";


            const title =
                document.createElement(
                    "h3"
                );

            title.className =
                "task-title";

            title.textContent =
                task.title;


            const meta =
                document.createElement(
                    "div"
                );

            meta.className =
                "task-meta";


            const subject =
                subjects.find(
                    (item) =>
                        item.id ===
                        task.subjectId
                );


            const subjectText =
                document.createElement(
                    "span"
                );

            subjectText.className =
                "task-subject";

            subjectText.textContent =
                subject
                    ? subject.name
                    : "Subject unavailable";


            const dateText =
                document.createElement(
                    "span"
                );

            dateText.className =
                "task-date";

            dateText.textContent =
                formatDate(
                    task.dueDate
                );


            if (
                !task.completed &&
                getDaysUntil(
                    task.dueDate
                ) < 0
            ) {

                dateText.classList.add(
                    "overdue"
                );

            }


            meta.appendChild(
                subjectText
            );

            meta.appendChild(
                dateText
            );


            details.appendChild(
                title
            );

            details.appendChild(
                meta
            );


            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.type =
                "button";

            deleteButton.className =
                "delete-button task-delete";

            deleteButton.textContent =
                "×";

            deleteButton.setAttribute(
                "aria-label",
                "Delete task"
            );


            deleteButton.addEventListener(
                "click",
                () =>
                    deleteTask(
                        task.id
                    )
            );


            item.appendChild(
                check
            );

            item.appendChild(
                details
            );

            item.appendChild(
                deleteButton
            );

            taskList.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   TOGGLE TASK
   ===================================================== */

function toggleTask(taskId) {

    const task =
        tasks.find(
            (item) =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    const wasCompleted =
        task.completed;


    task.completed =
        !task.completed;


    /*
       Completing a task counts as
       study activity for the current day.
    */

    if (
        !wasCompleted &&
        task.completed
    ) {

        addActivity();

    }


    writeStorage(
        STORAGE.tasks,
        tasks
    );


    renderAll();

}


/* =====================================================
   DELETE TASK
   ===================================================== */

function deleteTask(taskId) {

    if (
        !confirm(
            "Delete this task?"
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            (task) =>
                task.id !== taskId
        );


    writeStorage(
        STORAGE.tasks,
        tasks
    );


    renderAll();

}


/* =====================================================
   TASK FILTERS
   ===================================================== */

document
    .querySelectorAll(
        ".filter-button"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    activeFilter =
                        button.dataset.filter;


                    document
                        .querySelectorAll(
                            ".filter-button"
                        )
                        .forEach(
                            (item) => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    renderTasks();

                }
            );

        }
    );


/* =====================================================
   EXAMS
   ===================================================== */

examForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const name =
            examName.value.trim();

        const subjectId =
            examSubject.value;

        const date =
            examDate.value;


        if (
            !name ||
            !subjectId ||
            !date
        ) {

            return;

        }


        exams.push({

            id: createId(),

            name: name,

            subjectId: subjectId,

            date: date

        });


        writeStorage(
            STORAGE.exams,
            exams
        );


        examForm.reset();

        closeModal(
            examModal
        );

        renderAll();

    }
);


function renderExams() {

    examList.innerHTML =
        "";


    const sortedExams =
        [...exams].sort(
            (a, b) =>
                a.date.localeCompare(
                    b.date
                )
        );


    examEmptyState.style.display =
        sortedExams.length === 0
            ? "block"
            : "none";


    sortedExams.forEach(
        (exam) => {

            const date =
                new Date(
                    `${exam.date}T00:00:00`
                );


            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "exam-card";


            const dateBox =
                document.createElement(
                    "div"
                );

            dateBox.className =
                "exam-date-box";


            const day =
                document.createElement(
                    "span"
                );

            day.className =
                "exam-day";

            day.textContent =
                date.getDate();


            const month =
                document.createElement(
                    "span"
                );

            month.className =
                "exam-month";

            month.textContent =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        month: "short"
                    }
                );


            dateBox.appendChild(
                day
            );

            dateBox.appendChild(
                month
            );


            const details =
                document.createElement(
                    "div"
                );

            details.className =
                "exam-details";


            const name =
                document.createElement(
                    "h3"
                );

            name.className =
                "exam-name";

            name.textContent =
                exam.name;


            const subject =
                subjects.find(
                    (item) =>
                        item.id ===
                        exam.subjectId
                );


            const subjectText =
                document.createElement(
                    "p"
                );

            subjectText.className =
                "exam-subject";

            subjectText.textContent =
                subject
                    ? subject.name
                    : "Subject unavailable";


            details.appendChild(
                name
            );

            details.appendChild(
                subjectText
            );


            const countdown =
                document.createElement(
                    "span"
                );

            countdown.className =
                "exam-countdown";


            const days =
                getDaysUntil(
                    exam.date
                );


            if (days < 0) {

                countdown.textContent =
                    "Passed";

            } else if (days === 0) {

                countdown.textContent =
                    "Today";

            } else if (days === 1) {

                countdown.textContent =
                    "Tomorrow";

            } else {

                countdown.textContent =
                    `${days} days`;

            }


            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.type =
                "button";

            deleteButton.className =
                "delete-button";

            deleteButton.textContent =
                "×";

            deleteButton.setAttribute(
                "aria-label",
                "Delete exam"
            );


            deleteButton.addEventListener(
                "click",
                () =>
                    deleteExam(
                        exam.id
                    )
            );


            card.appendChild(
                dateBox
            );

            card.appendChild(
                details
            );

            card.appendChild(
                countdown
            );

            card.appendChild(
                deleteButton
            );

            examList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   DELETE EXAM
   ===================================================== */

function deleteExam(examId) {

    if (
        !confirm(
            "Delete this exam?"
        )
    ) {

        return;

    }


    exams =
        exams.filter(
            (exam) =>
                exam.id !== examId
        );


    writeStorage(
        STORAGE.exams,
        exams
    );


    renderAll();

}


/* =====================================================
   COMPLETION RATE
   ===================================================== */

function renderCompletionRate() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            (task) =>
                task.completed
        ).length;


    let rate = 0;


    if (total > 0) {

        rate =
            Math.round(
                (
                    completed /
                    total
                ) * 100
            );

    }


    completionRate.textContent =
        `${rate}%`;

    totalTaskCount.textContent =
        total;

}


/* =====================================================
   NEXT EXAM
   ===================================================== */

function renderNextExam() {

    const upcomingExams =
        exams
            .filter(
                (exam) =>
                    getDaysUntil(
                        exam.date
                    ) >= 0
            )
            .sort(
                (a, b) =>
                    a.date.localeCompare(
                        b.date
                    )
            );


    if (
        upcomingExams.length === 0
    ) {

        nextExamDays.textContent =
            "—";

        nextExamName.textContent =
            "No upcoming exam";

        return;

    }


    const next =
        upcomingExams[0];

    const days =
        getDaysUntil(
            next.date
        );


    if (days === 0) {

        nextExamDays.textContent =
            "Today";

    } else if (days === 1) {

        nextExamDays.textContent =
            "Tomorrow";

    } else {

        nextExamDays.textContent =
            `${days} days`;

    }


    nextExamName.textContent =
        next.name;

}


/* =====================================================
   WEEKLY OVERVIEW
   ===================================================== */

function getStartOfWeek() {

    const today =
        new Date();

    const day =
        today.getDay();

    /*
       Convert Sunday = 0 into
       Monday-based week.
    */

    const difference =
        day === 0
            ? -6
            : 1 - day;


    const monday =
        new Date(today);

    monday.setHours(
        0,
        0,
        0,
        0
    );

    monday.setDate(
        today.getDate() +
        difference
    );

    return monday;

}


function getDateStringFromDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function renderWeeklyOverview() {

    const monday =
        getStartOfWeek();

    const counts = {

        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        0: 0

    };


    activity.forEach(
        (dateString) => {

            const date =
                new Date(
                    `${dateString}T00:00:00`
                );

            const difference =
                Math.round(
                    (
                        date.getTime() -
                        monday.getTime()
                    ) / 86400000
                );


            if (
                difference >= 0 &&
                difference <= 6
            ) {

                counts[
                    date.getDay()
                ]++;

            }

        }
    );


    const values =
        Object.values(counts);

    const maximum =
        Math.max(
            ...values,
            1
        );


    Object.keys(
        weeklyBars
    ).forEach(
        (day) => {

            const bar =
                weeklyBars[day];

            if (!bar) {
                return;
            }


            const count =
                counts[day];


            let height =
                10;


            if (count > 0) {

                height =
                    Math.max(
                        18,
                        Math.round(
                            (
                                count /
                                maximum
                            ) * 100
                        )
                    );

            }


            bar.style.height =
                `${height}%`;

        }
    );


    const totalActiveDays =
        Object.values(
            counts
        ).filter(
            (count) =>
                count > 0
        ).length;


    if (
        totalActiveDays === 0
    ) {

        weeklySummary.textContent =
            "Complete a task to start your week.";

    } else if (
        totalActiveDays === 1
    ) {

        weeklySummary.textContent =
            "1 active study day this week.";

    } else if (
        totalActiveDays < 5
    ) {

        weeklySummary.textContent =
            `${totalActiveDays} active days this week. Keep going!`;

    } else {

        weeklySummary.textContent =
            `${totalActiveDays} active days this week. Excellent!`;

    }

}


/* =====================================================
   DASHBOARD
   ===================================================== */

function renderDashboard() {

    const completed =
        tasks.filter(
            (task) =>
                task.completed
        ).length;


    const pending =
        tasks.length -
        completed;


    const upcoming =
        exams.filter(
            (exam) =>
                getDaysUntil(
                    exam.date
                ) >= 0
        ).length;


    completedTaskCount.textContent =
        completed;

    pendingTaskCount.textContent =
        pending;

    examCount.textContent =
        upcoming;


    let percentage = 0;


    if (
        tasks.length > 0
    ) {

        percentage =
            Math.round(
                (
                    completed /
                    tasks.length
                ) * 100
            );

    }


    progressPercentage.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;


    if (
        tasks.length === 0
    ) {

        progressText.textContent =
            "Add tasks to start tracking your progress.";

    } else if (
        percentage === 100
    ) {

        progressText.textContent =
            "All tasks completed. Excellent work!";

    } else {

        progressText.textContent =
            `${completed} of ${tasks.length} tasks completed.`;

    }


    renderStreak();

    renderCompletionRate();

    renderNextExam();

    renderWeeklyOverview();

}


/* =====================================================
   DATE RESTRICTIONS
   ===================================================== */

function setDateRestrictions() {

    const today =
        getTodayString();

    taskDueDate.min =
        today;

    examDate.min =
        today;

}


/* =====================================================
   REFRESH APPLICATION
   ===================================================== */

function renderAll() {

    renderToday();

    renderSubjects();

    populateSubjectOptions();

    renderTasks();

    renderExams();

    renderDashboard();

}


/* =====================================================
   START APPLICATION
   ===================================================== */

setDateRestrictions();

renderAll();