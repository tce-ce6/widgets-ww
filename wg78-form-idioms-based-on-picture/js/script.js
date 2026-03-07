document.addEventListener("DOMContentLoaded", () => {
    const questions = [

        {
            image: "assets/Final Images/Aank ka tara.svg",
            muhawara: "आँखों का तारा",
            correctSequence: ['आँखों', 'का', 'तारा'],
            distractors: ['नयन', 'में', 'सितारा', 'पर'],
            arth: "अत्यंत प्रिय व्यक्ति",
            prayog: "राम अपने माता-पिता की आँखों का तारा है।"
        },

        {
            image: "assets/Final Images/Aag me ghee dalana.svg",
            muhawara: "आग में घी डालना",
            correctSequence: ['आग', 'में', 'घी', 'डालना'],
            distractors: ['गिराना', 'अग्नि', 'पर', 'से', 'तेल'],
            arth: "क्रोध को और बढ़ाना",
            prayog: "झगड़े के बीच में बोलकर तुमने आग में घी डालने का काम किया।"
        },

        {
            image: "assets/Final Images/Aank me dhool dalana.svg",
            muhawara: "आँखों में धूल झोंकना",
            correctSequence: ['आँखों', 'में', 'धूल', 'झोंकना'],
            distractors: ['पर', 'नेत्र', 'डालना', 'मिट्टी'],
            arth: "धोखा देना",
            prayog: "चोर पुलिस की आँखों में धूल झोंककर भाग गया।"
        },

        {
            image: "assets/Final Images/No do Graraha.svg",
            muhawara: "नौ दो ग्यारह होना",
            correctSequence: ['नौ', 'दो', 'ग्यारह', 'होना'],
            distractors: ['आठ', 'चार', 'मिलाकर', 'जोड़ना'],
            arth: "भाग जाना, गायब हो जाना",
            prayog: "पुलिस को देखते ही सभी बदमाश नौ दो ग्यारह हो गए।"
        },

        {
            image: "assets/Final Images/Eid ka chaand.svg",
            muhawara: "ईद का चाँद",
            correctSequence: ['ईद', 'का', 'चाँद'],
            distractors: ['से', 'लोहार', 'सूरज', 'में'],
            arth: "बहुत दिनों बाद दिखाई देना",
            prayog: "तुम तो ईद के चाँद हो गए हो।"
        },

        {
            image: "assets/Final Images/Chaati pe saap lotana.svg",
            muhawara: "छाती पर साँप लोटना",
            correctSequence: ['छाती', 'पर', 'साँप', 'लोटना'],
            distractors: ['का', 'लेटना', 'पीठ', 'को'],
            arth: "ईर्ष्या या जलन होना",
            prayog: "पड़ोसी की सफलता देखकर उसकी छाती पर साँप लोटने लगा।"
        },

        {
            image: "assets/Final Images/Aasman sar pe uthana.svg",
            muhawara: "आसमान सिर पर उठाना",
            correctSequence: ['आसमान', 'सिर', 'पर', 'उठाना'],
            distractors: ['का', 'आकाश', 'में', 'मस्तक'],
            arth: "बहुत शोर मचाना",
            prayog: "बच्चे खेलते समय आसमान सिर पर उठा रहे थे।"
        },

        {
            image: "assets/Final Images/Eant ka jawab patthar se.svg",
            muhawara: "ईंट का जवाब पत्थर से देना",
            correctSequence: ['ईंट', 'का', 'जवाब', 'पत्थर', 'से', 'देना'],
            distractors: ['उत्तर', 'मिट्टी', 'पर', 'लेकर'],
            arth: "कड़ा जवाब देना",
            prayog: "जब दुश्मन ने हमला किया तो हमने ईंट का जवाब पत्थर से दिया।"
        },

        {
            image: "assets/Final Images/Muh me pani ana.svg",
            muhawara: "मुँह में पानी आना",
            correctSequence: ['मुँह', 'में', 'पानी', 'आना'],
            distractors: ['पर', 'जल', 'डालना'],
            arth: "खाने की इच्छा होना",
            prayog: "गरम समोसे देखकर मेरे मुँह में पानी आ गया।"
        },

        {
            image: "assets/Final Images/Pairo pe kulhadi marana.svg",
            muhawara: "अपने पाँव में आप कुल्हाड़ी मारना",
            correctSequence: ['अपने', 'पाँव', 'में', 'आप', 'कुल्हाड़ी', 'मारना'],
            distractors: ['तुम', 'चेहरा', 'तीर', 'लगाना'],
            arth: "स्वयं अपना नुकसान करना",
            prayog: "नौकरी छोड़कर तुमने अपने पाँव में आप कुल्हाड़ी मार ली।"
        },

        {
            image: "assets/Final Images/Aakash se tare todana.svg",
            muhawara: "आकाश के तारे तोड़ लाना",
            correctSequence: ['आकाश', 'के', 'तारे', 'तोड़', 'लाना'],
            distractors: ['पर', 'सितारे', 'लेकर'],
            arth: "असंभव कार्य करना",
            prayog: "परीक्षा में प्रथम आना कोई आकाश के तारे तोड़ लाना नहीं है।"
        },

        {
            image: "assets/Final Images/Astin ka saap.svg",
            muhawara: "आस्तीन का साँप",
            correctSequence: ['आस्तीन', 'का', 'साँप'],
            distractors: ['से', 'हाथ', 'सर्प'],
            arth: "विश्वासघाती मित्र",
            prayog: "मोहन तो आस्तीन का साँप निकला।"
        },

        {
            image: "assets/Final Images/Ek aur ek gyaraha.svg",
            muhawara: "एक और एक ग्यारह होना",
            correctSequence: ['एक', 'और', 'एक', 'ग्यारह', 'होना'],
            distractors: ['से', 'दो', 'तीन', 'बनाना', 'जोड़ना'],
            arth: "एकता में शक्ति होना",
            prayog: "दोनों भाइयों ने मिलकर व्यापार किया तो एक और एक ग्यारह हो गए।"
        },

        {
            image: "assets/Final Images/Ek taang pe khade rahana.svg",
            muhawara: "एक टाँग पर खड़ा रहना",
            correctSequence: ['एक', 'टाँग', 'पर', 'खड़ा', 'रहना'],
            distractors: ['पैर', 'दो', 'चलना'],
            arth: "प्रतीक्षा करना",
            prayog: "मैं तुम्हारे लिए एक टाँग पर खड़ा नहीं रह सकता।"
        },

        {
            image: "assets/Final Images/Kichad Uchalana.svg",
            muhawara: "कीचड़ उछालना",
            correctSequence: ['कीचड़', 'उछालना'],
            distractors: ['कचरा', 'गिराना'],
            arth: "बदनामी करना",
            prayog: "चुनाव के समय नेता एक-दूसरे पर कीचड़ उछालते हैं।"
        },

        {
            image: "assets/Final Images/Dubate ko Tinke ka sahara.svg",
            muhawara: "डूबते को तिनके का सहारा",
            correctSequence: ['डूबते', 'को', 'तिनके', 'का', 'सहारा'],
            distractors: ['से', 'सहायता', 'तैरना', 'लकड़ी'],
            arth: "मुसीबत में थोड़ी सहायता भी बहुत होती है",
            prayog: "गरीबों के लिए कुछ रुपए भी डूबते को तिनके का सहारा हैं।"
        },

        {
            image: "assets/Final Images/Dato tale ungali.svg",
            muhawara: "दाँतों तले उँगली दबाना",
            correctSequence: ['दाँतों', 'तले', 'उँगली', 'दबाना'],
            distractors: ['नीचे', 'रखना'],
            arth: "आश्चर्यचकित होना",
            prayog: "उसका करतब देखकर सब दाँतों तले उँगली दबाने लगे।"
        },

        {
            image: "assets/Final Images/Do naav me pair.svg",
            muhawara: "दो नाव पर पैर रखना",
            correctSequence: ['दो', 'नाव', 'पर', 'पैर', 'रखना'],
            distractors: ['नौका', 'एक', 'चरण'],
            arth: "दोहरी नीति अपनाना",
            prayog: "दो नाव पर पैर रखने से तुम्हारा नुकसान होगा।"
        },

        {
            image: "assets/Final Images/Pani me aag.svg",
            muhawara: "पानी में आग लगाना",
            correctSequence: ['पानी', 'में', 'आग', 'लगाना'],
            distractors: ['जल', 'अग्नि', 'से'],
            arth: "असंभव कार्य करना",
            prayog: "उसने अपनी मेहनत से पानी में आग लगा दी।"
        },

        {
            image: "assets/Final Images/Pet me chuhe.svg",
            muhawara: "पेट में चूहे दौड़ना",
            correctSequence: ['पेट', 'में', 'चूहे', 'दौड़ना'],
            distractors: ['पीठ', 'बिल्ली'],
            arth: "बहुत भूख लगना",
            prayog: "सुबह से कुछ नहीं खाया, पेट में चूहे दौड़ रहे हैं।"
        },

        {
            image: "assets/Final Images/Gagar me Sagar.svg",
            muhawara: "गागर में सागर भरना",
            correctSequence: ['गागर', 'में', 'सागर', 'भरना'],
            distractors: ['कलश', 'समुद्र'],
            arth: "कम शब्दों में अधिक कहना",
            prayog: "बिहारी ने अपने दोहों में गागर में सागर भर दिया।"
        },

        {
            image: "assets/Final Images/Din me taare dikhna.svg",
            muhawara: "दिन में तारे दिखाई देना",
            correctSequence: ['दिन', 'में', 'तारे', 'दिखाई', 'देना'],
            distractors: ['दिवस', 'सितारे', 'देखना'],
            arth: "बहुत कष्ट होना",
            prayog: "तेज बुखार में मुझे दिन में तारे दिखाई दे रहे थे।"
        },

        {
            image: "assets/Final Images/Kolhu ka bail.svg",
            muhawara: "कोल्हू का बैल",
            correctSequence: ['कोल्हू', 'का', 'बैल'],
            distractors: ['से', 'मशीन', 'भैंस'],
            arth: "लगातार काम करने वाला",
            prayog: "वह दिन-रात काम करता है, बिल्कुल कोल्हू का बैल बन गया है।"
        },

        {
            image: "assets/Final Images/Panch Ungali ghee me.svg",
            muhawara: "पाँचों उँगलियाँ घी में होना",
            correctSequence: ['पाँचों', 'उँगलियाँ', 'घी', 'में', 'होना'],
            distractors: ['एक', 'हाथ', 'तेल', 'डालना'],
            arth: "हर तरफ से लाभ होना",
            prayog: "उस व्यापारी की पाँचों उँगलियाँ घी में हैं।"
        },

        {
            image: "assets/Final Images/Ungali pe nachana.svg",
            muhawara: "उँगली पर नचाना",
            correctSequence: ['उँगली', 'पर', 'नचाना'],
            distractors: ['हाथ', 'से', 'उठाना'],
            arth: "इशारों पर चलाना",
            prayog: "मालिक ने सभी कर्मचारियों को उँगली पर नचा रखा है।"
        }

    ];

    let currentQuestionIndex = 0;
    let currentStep = 0;
    let activeOptions = [];
    let currentCorrectSequence = [];

    // Target X coordinates for the blanks
    const stepX = 177;
    const targetY = 398.75; // derived from ty = -273.25 + 1.25 * 537.6 = 398.75
    const scaleFactor = 1.25;

    const svgElement = document.getElementById("Layer_1");
    const optionsGroup = document.getElementById("Options");
    const dynamicUnderscores = document.getElementById("dynamic_underscores");
    const questionImage = document.getElementById("question_image");

    // Game state elements
    const patchArth = document.getElementById("Arth_BG_Patch");
    const patchPrayog = document.getElementById("Prayog_BG_patch");
    const patchAgala = document.getElementById("Agala_udaharan_Tab");
    const patchUttarDekhe = document.getElementById("Uttar_dekhe_tab");
    const patchUttarChipaye = document.getElementById("Uttar_chipaye_Tab");
    const wrongBorder = document.getElementById("Wrong_answer_border");
    const instructionText = document.getElementById("I_text");
    const dynamicArthText = document.getElementById("dynamic_arth_text");
    const dynamicPrayogText = document.getElementById("dynamic_prayog_text");

    const correctAnswerPatch = document.getElementById("Correct_answer_patch");
    if (correctAnswerPatch) correctAnswerPatch.style.display = "none";

    // Unified success text
    let successText = document.getElementById("success_muhawara_text");
    if (!successText) {
        successText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        successText.id = "success_muhawara_text";
        successText.setAttribute("x", "1247");
        successText.setAttribute("y", "390");
        successText.setAttribute("text-anchor", "middle");
        successText.setAttribute("font-family", "NirmalaUI-Bold, 'Nirmala UI'");
        successText.setAttribute("font-size", "50");
        successText.setAttribute("font-weight", "bold");
        successText.setAttribute("fill", "#000");
        successText.style.display = "none";

        const muhawaraBg = document.getElementById("Muhawara_BG");
        if (muhawaraBg && muhawaraBg.parentNode) {
            muhawaraBg.parentNode.insertBefore(successText, muhawaraBg.nextSibling);
        } else {
            svgElement.appendChild(successText);
        }
    }

    const optionPositions = [
        { x: 706, y: 526.6 }, { x: 928, y: 526.6 }, { x: 1150, y: 526.6 }, { x: 1373, y: 526.6 }, { x: 1596, y: 525.6 },
        { x: 705, y: 635.6 }, { x: 928, y: 636.6 }, { x: 1150, y: 636.6 }, { x: 1373, y: 636.6 }, { x: 1596, y: 635.6 }
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createClone(rectId) {
        const originalRect = document.getElementById(rectId);
        const clone = originalRect.cloneNode(true);
        clone.id = rectId + "_clone";
        clone.setAttribute("fill", "#e0e0e0"); // grey
        originalRect.parentNode.insertBefore(clone, originalRect);
    }

    function loadQuestion(index) {
        currentStep = 0;
        const q = questions[index];
        currentCorrectSequence = q.correctSequence;

        // Update image
        if (questionImage) {
            questionImage.setAttribute("href", q.image);
        }

        // Update Texts
        successText.textContent = q.muhawara;
        if (dynamicArthText) dynamicArthText.textContent = q.arth;
        if (dynamicPrayogText) dynamicPrayogText.textContent = q.prayog;

        // Draw Options
        optionsGroup.innerHTML = "";
        activeOptions = [];

        let allWords = [...q.correctSequence, ...q.distractors];
        allWords = allWords.slice(0, 10);
        shuffleArray(allWords);

        allWords.forEach((word, idx) => {
            const pos = optionPositions[idx];
            const rectId = `Option_Rect_${idx}`;
            const textId = `Option_Text_${idx}`;

            activeOptions.push({
                word: word,
                rectId: rectId,
                textId: textId,
                initialX: pos.x,
                initialY: pos.y
            });

            // Create Rect
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("id", rectId);
            rect.setAttribute("x", pos.x);
            rect.setAttribute("y", pos.y);
            rect.setAttribute("width", "192");
            rect.setAttribute("height", "83");
            rect.setAttribute("rx", "17");
            rect.setAttribute("ry", "17");
            rect.setAttribute("fill", "#fff");
            rect.style.cursor = "pointer";

            // Create Text
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("id", textId);
            text.setAttribute("x", pos.x + 96);
            text.setAttribute("y", pos.y + 55);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("font-family", "NirmalaUI-Bold, 'Nirmala UI'");
            text.setAttribute("font-size", "35");
            text.setAttribute("font-weight", "bold");
            text.setAttribute("fill", "#000");
            text.textContent = word;
            text.style.cursor = "pointer";

            const clickHandler = () => handleWordClick(activeOptions[idx]);
            rect.addEventListener("click", clickHandler);
            text.addEventListener("click", clickHandler);

            optionsGroup.appendChild(rect);
            optionsGroup.appendChild(text);
        });

        // Draw individual Underscores dynamically to center them
        dynamicUnderscores.innerHTML = "";
        const totalBlanks = q.correctSequence.length;

        // Calculate center based on total blanks
        const totalWidth = (totalBlanks - 1) * 177;
        const startX = 1247 - (totalWidth / 2);

        q.targetXBase = startX;

        for (let i = 0; i < totalBlanks; i++) {
            const underscore = document.createElementNS("http://www.w3.org/2000/svg", "text");
            underscore.setAttribute("id", `underscore_${i}`);
            underscore.setAttribute("font-family", "Roboto-Regular, Roboto");
            underscore.setAttribute("font-size", "50");
            underscore.setAttribute("fill", "#000");
            underscore.setAttribute("text-anchor", "middle");

            const uX = startX + i * 177;
            underscore.setAttribute("transform", `translate(${uX} 395.6)`);
            underscore.textContent = "_______";

            dynamicUnderscores.appendChild(underscore);
        }

        resetGameUI();
    }

    function handleWordClick(option) {
        if (currentStep >= currentCorrectSequence.length) return;

        if (option.word === currentCorrectSequence[currentStep]) {
            createClone(option.rectId);

            const rectEl = document.getElementById(option.rectId);
            const textEl = document.getElementById(option.textId);

            const q = questions[currentQuestionIndex];

            const targetX_center = q.targetXBase + (currentStep * stepX);
            const targetY_baseline = 390; // Just slightly above the underline at 395.6

            // The text element's original attributes
            const textX = parseFloat(textEl.getAttribute("x")) || (option.initialX + 96);
            const textY = parseFloat(textEl.getAttribute("y")) || (option.initialY + 55);

            // Perfect affine reverse-calculation
            const tx = targetX_center - scaleFactor * textX;
            const ty = targetY_baseline - scaleFactor * textY;

            const transformString = `matrix(${scaleFactor}, 0, 0, ${scaleFactor}, ${tx}, ${ty})`;

            // Hide the underline at this specific slot
            const underScoreEl = document.getElementById(`underscore_${currentStep}`);
            if (underScoreEl) {
                underScoreEl.style.opacity = "0";
            }

            // Hide the actual white rectangle so it doesn't cover the underline
            rectEl.style.opacity = "0";
            rectEl.style.pointerEvents = "none";
            textEl.style.pointerEvents = "none";

            textEl.style.transition = "transform 0.5s ease";
            textEl.style.transform = transformString;
            textEl.setAttribute("transform", transformString);

            currentStep++;

            if (currentStep === currentCorrectSequence.length) {
                showSuccessState(false);
            }
        } else {
            const rectEl = document.getElementById(option.rectId);
            const textEl = document.getElementById(option.textId);
            const strokeRect = wrongBorder.querySelector('rect[stroke="red"]');

            if (strokeRect) {
                strokeRect.setAttribute('x', option.initialX + 3.5);
                strokeRect.setAttribute('y', option.initialY + 3.5);
                strokeRect.setAttribute('width', 185);
                strokeRect.setAttribute('height', 76);
            }
            wrongBorder.style.display = "block";

            const shakeKeyframes = [
                { transform: 'translateX(0px)' },
                { transform: 'translateX(-6px)' },
                { transform: 'translateX(6px)' },
                { transform: 'translateX(-6px)' },
                { transform: 'translateX(6px)' },
                { transform: 'translateX(0px)' }
            ];
            const shakeOptions = { duration: 400, easing: 'ease-in-out' };

            rectEl.animate(shakeKeyframes, shakeOptions);
            textEl.animate(shakeKeyframes, shakeOptions);
            wrongBorder.animate(shakeKeyframes, shakeOptions);

            setTimeout(() => {
                wrongBorder.style.display = "none";
            }, 1000);
        }
    }

    function applySuccessVisibility(isShowingAnswer) {
        if (instructionText) instructionText.style.display = "none";

        const optionBg = document.getElementById("Option_BG");
        if (optionBg) optionBg.style.display = "none";

        if (dynamicUnderscores) dynamicUnderscores.style.display = "none";

        activeOptions.forEach(opt => {
            const clone = document.getElementById(opt.rectId + "_clone");
            if (clone) clone.style.display = "none";

            const r = document.getElementById(opt.rectId);
            const t = document.getElementById(opt.textId);
            if (r) r.style.display = "none";
            if (t) t.style.display = "none";
        });

        successText.style.display = "block";
        patchArth.style.display = "block";
        patchPrayog.style.display = "block";
        patchUttarDekhe.style.display = "none";

        if (isShowingAnswer) {
            patchUttarChipaye.style.display = "block";
            patchAgala.style.display = "none";
        } else {
            patchAgala.style.display = "block";
            patchUttarChipaye.style.display = "none";
        }
    }

    function showSuccessState(isShowingAnswer) {
        if (isShowingAnswer) {
            applySuccessVisibility(true);
        } else {
            setTimeout(() => {
                applySuccessVisibility(false);
            }, 500);
        }
    }

    function showAnswer() {
        currentStep = currentCorrectSequence.length;
        showSuccessState(true);
    }

    function resetGameUI() {
        if (instructionText) instructionText.style.display = "block";

        const optionBg = document.getElementById("Option_BG");
        if (optionBg) optionBg.style.display = "block";

        if (dynamicUnderscores) {
            dynamicUnderscores.style.display = "block";
            Array.from(dynamicUnderscores.children).forEach(child => {
                child.style.opacity = "1";
            });
        }

        successText.style.display = "none";

        activeOptions.forEach(opt => {
            const clone = document.getElementById(opt.rectId + "_clone");
            if (clone) clone.remove();

            const rectEl = document.getElementById(opt.rectId);
            const textEl = document.getElementById(opt.textId);
            if (rectEl && textEl) {
                rectEl.style.transition = "none";
                textEl.style.transition = "none";
                rectEl.style.transform = "none";
                textEl.style.transform = "none";
                rectEl.removeAttribute("transform");
                textEl.removeAttribute("transform");
                rectEl.style.opacity = "1";
                rectEl.style.pointerEvents = "auto";
                textEl.style.pointerEvents = "auto";
                rectEl.style.display = "block";
                textEl.style.display = "block";
            }
        });

        patchArth.style.display = "none";
        patchPrayog.style.display = "none";
        patchAgala.style.display = "none";
        patchUttarChipaye.style.display = "none";
        wrongBorder.style.display = "none";

        patchUttarDekhe.style.display = "block";
    }

    function resetGameUIAndStep() {
        currentStep = 0;
        resetGameUI();
    }

    function nextQuestion() {
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        loadQuestion(currentQuestionIndex);
    }

    // Controls
    if (patchUttarDekhe) {
        patchUttarDekhe.style.cursor = "pointer";
        patchUttarDekhe.addEventListener("click", showAnswer);
    }

    if (patchUttarChipaye) {
        patchUttarChipaye.style.cursor = "pointer";
        patchUttarChipaye.addEventListener("click", resetGameUIAndStep);
    }

    if (patchAgala) {
        patchAgala.style.cursor = "pointer";
        patchAgala.addEventListener("click", nextQuestion);
    }

    // Initial Load
    loadQuestion(currentQuestionIndex);
});
