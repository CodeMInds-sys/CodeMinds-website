const form = document.getElementById("marriageForm");

const steps = document.querySelectorAll(".form-step");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");

const progress = document.getElementById("progress");
const BASE_URL = "https://wsal-kappa.vercel.app/";

const currentStepElement =
    document.getElementById("currentStep");

const stepTitle =
    document.getElementById("stepTitle");

const message =
    document.getElementById("message");

const STORAGE_KEY = "marriage_form_draft";

let currentStep = 1;

const stepTitles = [
    "البيانات الأساسية",
    "التعليم والعمل",
    "السكن والإقامة",
    "معلومات الأسرة",
    "الحالة الاجتماعية والزواج",
    "الدين والصحة",
    "مواصفات العروسة المطلوبة",
    "معلومات التواصل"
];


// =====================================================
// HELPERS
// =====================================================

function getValue(id) {
    return document.getElementById(id).value;
}


function setValue(id, value) {
    const element = document.getElementById(id);

    if (!element || value === undefined || value === null) {
        return;
    }

    element.value = value;
}


function getBooleanValue(id) {

    const value = getValue(id);

    if (value === "") {
        return null;
    }

    return value === "true";
}


function setBooleanValue(id, value) {

    const element = document.getElementById(id);

    if (!element || value === undefined || value === null) {
        return;
    }

    element.value = value ? "true" : "false";
}


function getNumberValue(id) {

    const value = getValue(id);

    if (value === "") {
        return null;
    }

    return Number(value);
}


// =====================================================
// AGE OPTIONS
// =====================================================

function populateAgeOptions() {

    const minAge = document.getElementById("minAge");
    const maxAge = document.getElementById("maxAge");

    for (let age = 16; age <= 80; age++) {

        const option1 = document.createElement("option");
        option1.value = age;
        option1.textContent = age;

        const option2 = document.createElement("option");
        option2.value = age;
        option2.textContent = age;

        minAge.appendChild(option1);
        maxAge.appendChild(option2);
    }
}


// =====================================================
// SHOW / HIDE STEPS
// =====================================================

function showStep(step) {

    steps.forEach((section) => {
        section.classList.remove("active");
    });

    const activeStep =
        document.querySelector(
            `.form-step[data-step="${step}"]`
        );

    activeStep.classList.add("active");

    currentStepElement.textContent = step;

    stepTitle.textContent = stepTitles[step - 1];

    const percentage =
        (step / steps.length) * 100;

    progress.style.width = `${percentage}%`;

    prevBtn.classList.toggle(
        "hidden",
        step === 1
    );

    nextBtn.classList.toggle(
        "hidden",
        step === steps.length
    );

    submitBtn.classList.toggle(
        "hidden",
        step !== steps.length
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================================
// VALIDATION
// =====================================================

function validateCurrentStep() {

    const currentSection =
        document.querySelector(
            `.form-step[data-step="${currentStep}"]`
        );

    const inputs =
        currentSection.querySelectorAll(
            "input, select, textarea"
        );

    for (const input of inputs) {

        if (
            input.required &&
            !input.disabled &&
            !input.checkValidity()
        ) {

            input.reportValidity();

            return false;
        }
    }


    // Validate age range

    if (currentStep === 7) {

        const minAge =
            Number(getValue("minAge"));

        const maxAge =
            Number(getValue("maxAge"));

        if (minAge > maxAge) {

            alert(
                "سن البداية لا يمكن أن يكون أكبر من سن النهاية."
            );

            return false;
        }


        // At least one hijab option

        const hijab =
            document.querySelectorAll(
                'input[name="hijab"]:checked'
            );

        if (hijab.length === 0) {

            alert(
                "برجاء اختيار نوع الحجاب المقبول."
            );

            return false;
        }
    }


    return true;
}


// =====================================================
// CONDITIONAL MARITAL STATUS
// =====================================================

const maritalStatus =
    document.getElementById("maritalStatus");

const childrenField =
    document.getElementById("childrenField");

const haveChildren =
    document.getElementById("haveChildren");


function handleMaritalStatus() {

    const status = maritalStatus.value;

    const hasPreviousMarriage =
        status === "مطلق" ||
        status === "أرمل";


    if (hasPreviousMarriage) {

        childrenField.classList.remove("hidden");

        haveChildren.disabled = false;

        haveChildren.required = true;

        if (haveChildren.value === "") {
            haveChildren.value = "0";
        }

    } else {

        childrenField.classList.add("hidden");

        haveChildren.value = "0";

        haveChildren.disabled = true;

        haveChildren.required = false;
    }
}


maritalStatus.addEventListener(
    "change",
    handleMaritalStatus
);


// =====================================================
// EDUCATION CONDITIONAL FIELD
// =====================================================

const education =
    document.getElementById("education");

const universityMajorField =
    document.getElementById("universityMajorField");

const universityMajor =
    document.getElementById("universityMajor");


function handleEducation() {

    const value = education.value;

    const shouldShow =
        value === "جامعي" ||
        value === "دراسات عليا";


    if (shouldShow) {

        universityMajorField.classList.remove("hidden");

    } else {

        universityMajorField.classList.add("hidden");

        universityMajor.value = "";
    }
}


education.addEventListener(
    "change",
    handleEducation
);


// =====================================================
// HIJAB
// =====================================================

const hijabCheckboxes =
    document.querySelectorAll(
        'input[name="hijab"]'
    );


hijabCheckboxes.forEach((checkbox) => {

    checkbox.addEventListener(
        "change",
        function () {

            const noMatter =
                document.querySelector(
                    'input[name="hijab"][value="لا يهم"]'
                );


            if (
                this.value === "لا يهم" &&
                this.checked
            ) {

                hijabCheckboxes.forEach((item) => {

                    if (item !== this) {
                        item.checked = false;
                    }

                });

            } else if (
                this.value !== "لا يهم" &&
                this.checked
            ) {

                noMatter.checked = false;
            }
        }
    );
});


// =====================================================
// GET HIJAB VALUES
// =====================================================

function getHijabValues() {

    return Array.from(
        document.querySelectorAll(
            'input[name="hijab"]:checked'
        )
    ).map(
        checkbox => checkbox.value
    );
}


// =====================================================
// BUILD JSON
// =====================================================

function getFormData() {

    return {

        basicInfo: {

            name: getValue("name"),

            birthDate: getValue("birthDate"),

            nationality: getValue("nationality"),

            weight: getNumberValue("weight"),

            height: getNumberValue("height"),

            skinColor: getValue("skinColor"),

            photo: getValue("photo"),

            description: getValue("description")
        },


        educationAndWork: {

            education: getValue("education"),

            universityMajor:
                getValue("universityMajor"),

            job: getValue("job"),

            jobDescription:
                getValue("jobDescription")
        },


        residence: {

            city: getValue("city"),

            currentPlaceOfResidence:
                getValue("currentPlaceOfResidence"),

            expatriate:
                getValue("expatriate"),

            maritalHome:
                getValue("maritalHome"),

            maritalHomeDescription:
                getValue("maritalHomeDescription")
        },


        familyInfo: {

            fatherJob:
                getValue("fatherJob"),

            motherJob:
                getValue("motherJob"),

            siblingsInfo:
                getValue("siblingsInfo"),

            parentsSeparated:
                getBooleanValue("parentsSeparated")
        },


        maritalInfo: {

            maritalStatus:
                getValue("maritalStatus"),

            marriageType:
                getValue("marriageType"),

            haveChildren:
                getValue("haveChildren"),

            polygamy:
                getValue("polygamy"),

            wantChildren:
                getValue("wantChildren"),

            ringType:
                getValue("ringType"),

            mahr:
                getNumberValue("mahr")
        },


        religionAndHealth: {

            smoker:
                getBooleanValue("smoker"),

            bearded:
                getBooleanValue("bearded"),

            prayFiveTimes:
                getBooleanValue("prayFiveTimes"),

            prayInMosque:
                getValue("prayInMosque"),

            quranMemorization:
                getNumberValue("quranMemorization"),

            hasDisabilityOrIllness:
                getValue("hasDisabilityOrIllness")
        },


        brideRequirements: {

            minAge:
                getNumberValue("minAge"),

            maxAge:
                getNumberValue("maxAge"),

            description:
                getValue("brideDescription"),

            maritalStatus:
                getValue("brideMaritalStatus"),

            education:
                getValue("brideEducation"),

            hijab:
                getHijabValues(),

            furnitureList:
                getValue("furnitureList")
        },


        contactInfo: {

            whatsapp:
                getValue("whatsapp"),

            telegram:
                getValue("telegram"),

            facebook:
                getValue("facebook"),

            about:
                getValue("about"),

            additionalNotes:
                getValue("additionalNotes")
        }

    };
}


// =====================================================
// LOCAL STORAGE
// =====================================================

function saveDraft() {

    const data = getFormData();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


function restoreDraft() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return;
    }

    try {

        const data =
            JSON.parse(saved);


        // Basic Info

        setValue(
            "name",
            data.basicInfo?.name
        );

        setValue(
            "birthDate",
            data.basicInfo?.birthDate
        );

        setValue(
            "nationality",
            data.basicInfo?.nationality
        );

        setValue(
            "weight",
            data.basicInfo?.weight
        );

        setValue(
            "height",
            data.basicInfo?.height
        );

        setValue(
            "skinColor",
            data.basicInfo?.skinColor
        );

        setValue(
            "photo",
            data.basicInfo?.photo
        );

        setValue(
            "description",
            data.basicInfo?.description
        );


        // Education

        setValue(
            "education",
            data.educationAndWork?.education
        );

        setValue(
            "universityMajor",
            data.educationAndWork?.universityMajor
        );

        setValue(
            "job",
            data.educationAndWork?.job
        );

        setValue(
            "jobDescription",
            data.educationAndWork?.jobDescription
        );


        // Residence

        setValue(
            "city",
            data.residence?.city
        );

        setValue(
            "currentPlaceOfResidence",
            data.residence?.currentPlaceOfResidence
        );

        setValue(
            "expatriate",
            data.residence?.expatriate
        );

        setValue(
            "maritalHome",
            data.residence?.maritalHome
        );

        setValue(
            "maritalHomeDescription",
            data.residence?.maritalHomeDescription
        );


        // Family

        setValue(
            "fatherJob",
            data.familyInfo?.fatherJob
        );

        setValue(
            "motherJob",
            data.familyInfo?.motherJob
        );

        setValue(
            "siblingsInfo",
            data.familyInfo?.siblingsInfo
        );

        setBooleanValue(
            "parentsSeparated",
            data.familyInfo?.parentsSeparated
        );


        // Marital

        setValue(
            "maritalStatus",
            data.maritalInfo?.maritalStatus
        );

        setValue(
            "marriageType",
            data.maritalInfo?.marriageType
        );

        setValue(
            "haveChildren",
            data.maritalInfo?.haveChildren
        );

        setValue(
            "polygamy",
            data.maritalInfo?.polygamy
        );

        setValue(
            "wantChildren",
            data.maritalInfo?.wantChildren
        );

        setValue(
            "ringType",
            data.maritalInfo?.ringType
        );

        setValue(
            "mahr",
            data.maritalInfo?.mahr
        );


        // Religion

        setBooleanValue(
            "smoker",
            data.religionAndHealth?.smoker
        );

        setBooleanValue(
            "bearded",
            data.religionAndHealth?.bearded
        );

        setBooleanValue(
            "prayFiveTimes",
            data.religionAndHealth?.prayFiveTimes
        );

        setValue(
            "prayInMosque",
            data.religionAndHealth?.prayInMosque
        );

        setValue(
            "quranMemorization",
            data.religionAndHealth?.quranMemorization
        );

        setValue(
            "hasDisabilityOrIllness",
            data.religionAndHealth?.hasDisabilityOrIllness
        );


        // Bride Requirements

        setValue(
            "minAge",
            data.brideRequirements?.minAge
        );

        setValue(
            "maxAge",
            data.brideRequirements?.maxAge
        );

        setValue(
            "brideMaritalStatus",
            data.brideRequirements?.maritalStatus
        );

        setValue(
            "brideEducation",
            data.brideRequirements?.education
        );

        setValue(
            "brideDescription",
            data.brideRequirements?.description
        );

        setValue(
            "furnitureList",
            data.brideRequirements?.furnitureList
        );


        if (
            Array.isArray(
                data.brideRequirements?.hijab
            )
        ) {

            hijabCheckboxes.forEach(
                checkbox => {

                    checkbox.checked =
                        data.brideRequirements.hijab.includes(
                            checkbox.value
                        );

                }
            );
        }


        // Contact

        setValue(
            "whatsapp",
            data.contactInfo?.whatsapp
        );

        setValue(
            "telegram",
            data.contactInfo?.telegram
        );

        setValue(
            "facebook",
            data.contactInfo?.facebook
        );

        setValue(
            "about",
            data.contactInfo?.about
        );

        setValue(
            "additionalNotes",
            data.contactInfo?.additionalNotes
        );


        // Restore conditional fields

        handleMaritalStatus();

        handleEducation();

    } catch (error) {

        console.error(
            "Failed to restore draft:",
            error
        );

    }
}


// =====================================================
// AUTO SAVE
// =====================================================

form.addEventListener(
    "input",
    saveDraft
);

form.addEventListener(
    "change",
    saveDraft
);


// =====================================================
// NAVIGATION
// =====================================================

nextBtn.addEventListener(
    "click",
    () => {

        if (!validateCurrentStep()) {
            return;
        }

        saveDraft();

        if (currentStep < steps.length) {

            currentStep++;

            showStep(currentStep);
        }
    }
);


prevBtn.addEventListener(
    "click",
    () => {

        if (currentStep > 1) {

            currentStep--;

            showStep(currentStep);
        }
    }
);


// =====================================================
// SUBMIT
// =====================================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!validateCurrentStep()) {
            return;
        }


        const data = getFormData();

        console.log(
            "JSON sent to backend:",
            data
        );


        submitBtn.disabled = true;

        submitBtn.textContent =
            "جاري الإرسال...";


        try {

            const response =
                await fetch(
                    `${BASE_URL}/api/maleForms/addMaleForm`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "حدث خطأ أثناء إرسال البيانات"
                );
            }


            // Success

            localStorage.removeItem(
                STORAGE_KEY
            );


            message.textContent =
                "تم إرسال البيانات بنجاح.";

            message.className =
                "message-success";


            form.reset();

            currentStep = 1;

            handleMaritalStatus();

            handleEducation();

            showStep(1);


        } catch (error) {

            console.error(error);

            message.textContent =
                error.message ||
                "حدث خطأ أثناء إرسال البيانات.";

            message.className =
                "message-error";

        } finally {

            submitBtn.disabled = false;

            submitBtn.textContent =
                "إرسال الطلب";
        }

    }
);


// =====================================================
// INITIALIZATION
// =====================================================

populateAgeOptions();

showStep(1);

handleMaritalStatus();

handleEducation();

restoreDraft();