const mongoose = require("mongoose");

const femaleSchema = new mongoose.Schema({
    basicInfo: {
        name: {
            type: String,
            required: [true, 'name is required'],
            minlength: [3, 'name must be at least 3 characters long'],
            trim: true
        },

        birthDate: {
            type: Date,
            required: [true, 'birth date is required']
        },

        nationality: {
            type: String,
            required: [true, 'nationality is required']
        },

        weight: {
            type: Number,
            required: [true, 'weight is required']
        },

        height: {
            type: Number,
            required: [true, 'height is required']
        },

        skinColor: {
            type: String,
            required: [true, 'skin color is required'],
            enum: [
                'اسمر داكن',
                'اسمر',
                'قمحى غامق',
                'قمحى فاتح',
                'ابيض',
                'ابيض فاتح جدا'
            ]
        },

        photo: {
            type: String
        },

        description: {
            type: String,
            trim: true
        }
    },

    educationAndWork: {

        education: {
            type: String,
            required: [true, 'education is required']
        },

        universityMajor: {
            type: String
        },

        job: {
            type: String,
            required: [true, 'job is required']
        },

        jobDescription: {
            type: String
        }
    },

    residence: {

        city: {
            type: String
        },

        currentPlaceOfResidence: {
            type: String
        },

        expatriate: {
            type: String,
            required: [true, 'expatriate is required'],
            enum: ['نعم', 'لا', 'حسب الاتفاق']
        },

        maritalHome: {
            type: String,
            required: [true, 'marital home is required']
        },

        maritalHomeDescription: {
            type: String
        }
    },


    familyInfo: {

        fatherJob: {
            type: String,
            trim: true
        },

        motherJob: {
            type: String,
            trim: true
        },

        siblingsInfo: {
            type: String,
            required: [true, 'siblings information is required'],
            trim: true
        },

        parentsSeparated: {
            type: Boolean,
            required: [true, 'parents separated is required']
        }
    },

    maritalInfo: {

        maritalStatus: {
            type: String,
            required: [true, 'marital status is required'],
            enum: [
                'عزباء',
                'عزباء سبق لها عقد أو كتب كتاب',
                'مطلق',
                'أرمل'
            ]
        },
        marriageType: {
            type: String,
            required: [true, 'marriage type is required'],
            enum: [
                'زواج بقائمة منقولات',
                'زواج شرعي بدون قائمة',
                'على حسب الاتفاق'
            ]
        },

        haveChildren: {
            type: String,
            required: [true, 'have children is required'],
            default: "0"
        },

        polygamy: {
            type: String,
            required: [true, 'polygamy is required'],
            enum: ['نعم', 'لا', 'حسب الاتفاق']
        },
        wantChildren: {
            type: String,
            required: [true, 'want children is required'],
            enum: ['نعم', 'لا', 'أفضل تأخير الانجاب']
        },

        ringType: {
            type: String,
            required: [true, 'ring type is required']
        },

        mahr: {
            type: Number,
            required: [true, 'mahr is required']
        }
    },

    religionAndHealth: {

        smoker: {
            type: Boolean,
            required: [true, 'smoker is required']
        },

        hijab: {
            type: [String],
            required: [true, 'acceptable hijab types are required'],
            enum: [
                'منتقبة نقاب كامل',
                'منتقبة فقط',
                'محجبة مختمرة',
                'محجبة',
                'غير محجبة',
                'لا يهم'
            ]
        },

        prayFiveTimes: {
            type: Boolean,
            required: [true, 'pray five times is required']
        },

        praysOnTime: {
            type: Boolean,
            required: [true, 'prays on time is required']
        },

        quranMemorization: {
            type: Number,
            required: [true, 'quran memorization is required'],
            min: [0, 'quran memorization cannot be negative'],
            max: [30, 'quran memorization cannot exceed 30']
        },

        hasDisabilityOrIllness: {
            type: String,
            required: [true, 'has disability or illness is required']
        }
    },


    brideRequirements: {

        minAge: {
            type: Number,
            required: [true, 'minimum age is required'],
            min: [16, 'minimum age must be at least 16']
        },

        maxAge: {
            type: Number,
            required: [true, 'maximum age is required'],
            max: [80, 'maximum age cannot exceed 80']
        },

        description: {
            type: String,
            trim: true
        },

        education: {
            type: String,
            required: [true, 'bride education is required'],
            enum: [
                'بدون مؤهل',
                'متوسط',
                'فوق المتوسط',
                'جامعي',
                'دراسات عليا',
                'غير مهم'
            ]
        },

        hijab: {
            type: [String],
            required: [true, 'acceptable hijab types are required'],
            enum: [
                'منتقبة نقاب كامل',
                'منتقبة فقط',
                'محجبة مختمرة',
                'محجبة',
                'غير محجبة',
                'لا يهم'
            ]
        },

 
    },

    contactInfo: {

        whatsapp: {
            type: String,
            trim: true
        },

        telegram: {
            type: String,
            trim: true
        },

        facebook: {
            type: String,
            trim: true,
            required: [true, 'facebook is required']
        },

        about: {
            type: String,
            required: [true, 'about is required'],
            trim: true
        },

        additionalNotes: {
            type: String,
            trim: true
        }
    },
    public: {
        type: Boolean,
        default: false
    }

});

const Female = mongoose.model("Female", femaleSchema);
module.exports = Female;