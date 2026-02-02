let learnBtn, exampleBtn, homeBtn, learnPage, homePage, practicePage, practiceExamples, municipalCommissioner, localRestaurant, customerService;


document.addEventListener("DOMContentLoaded", () => {
    learnBtn = document.getElementById('learn-btn');
    exampleBtn = document.getElementById('example-btn');
    learnPage = document.getElementById('learn-page');
    homePage = document.getElementById('home-page');
    practicePage = document.getElementById('practice-page');
    homeBtn = document.getElementById('home-btn');
    customerService = document.getElementById('customer-service');
    localRestaurant = document.getElementById('local-restaurant');
    municipalCommissioner = document.getElementById('municipal-commissioner');


    practiceExamples = document.getElementById('practice-examples')

    learnPage.style.display = 'none';

    learnBtn.addEventListener('click', () => {
        learnPage.style.display = 'block';
        homePage.style.display = 'none';
        homeBtn.style.display = 'block';
    });

    exampleBtn.addEventListener('click', () => {
        practiceExamples.style.display = 'block';
        homePage.style.display = 'none';
        homeBtn.style.display = 'block';
    });

    homeBtn.addEventListener('click', () => {
        homeBtn.style.display = 'none';
        homePage.style.display = 'block';
        learnPage.style.display = 'none';
        practiceExamples.style.display = 'none';
        practicePage.style.display = 'none';
    });

    customerService.addEventListener('click', () => {
        practiceExamples.style.display = 'none';
        practicePage.style.display = 'block';
    });
});