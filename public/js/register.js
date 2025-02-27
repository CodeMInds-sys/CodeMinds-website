document.addEventListener('DOMContentLoaded', () => {
    console.log('Register page loaded');
    
    const form = document.getElementById('registerForm');
    if (!form) {
        console.error('Register form not found in DOM');
        return;
    }

    // حفظ النص الأصلي لزر التسجيل
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.setAttribute('data-original-text', submitButton.innerHTML);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Register form submitted');
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const nameInput = document.getElementById('name');

        if (!emailInput || !passwordInput || !confirmPasswordInput || !nameInput) {
            console.error('Form inputs not found', {
                emailExists: !!emailInput,
                passwordExists: !!passwordInput,
                confirmExists: !!confirmPasswordInput,
                nameExists: !!nameInput
            });
            showToast('حدث خطأ في النموذج', true);
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const name = nameInput.value.trim();

        // التحقق من صحة البيانات
        if (!email || !password || !confirmPassword || !name) {
            console.warn('Empty fields detected');
            showToast("جميع الحقول مطلوبة", true);
            return;
        }

        if (!validateInput(email, 'email')) {
            console.warn('Invalid email format', { email });
            showToast("بريد إلكتروني غير صالح", true);
            return;
        }

        if (!validateInput(name, 'name')) {
            console.warn('Invalid name format', { name });
            showToast("الاسم يجب أن يكون 3 أحرف على الأقل", true);
            return;
        }

        if (password !== confirmPassword) {
            console.warn('Passwords do not match');
            showToast("كلمة المرور غير متطابقة", true);
            return;
        }

        if (!validateInput(password, 'password')) {
            console.warn('Weak password detected');
            showToast("كلمة المرور ضعيفة", true);
            return;
        }

        toggleLoading(true);
        console.log('Starting registration request', { email, name });

        try {
            const response = await fetch(`http://localhost:3000/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, name })
            });

            const data = await response.json();
            console.log('Registration response received', {
                status: response.status,
                ok: response.ok
            });

            if (response.ok) {
                console.log('Registration successful', { email });
                showToast("تم إنشاء الحساب بنجاح! يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني");
                
                // إضافة تأخير قبل التوجيه لصفحة تسجيل الدخول
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 3000);
            } else {
                console.warn('Registration failed', {
                    status: response.status,
                    message: data.message
                });
                showToast(data.message || "فشل في التسجيل", true);
            }
        } catch (error) {
            console.error('Registration request failed', error);
            showToast("حدث خطأ في الاتصال بالخادم", true);
        } finally {
            toggleLoading(false);
        }
    });
});

function isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
} 