document.addEventListener('DOMContentLoaded', () => {
    console.log('Profile page loaded');

    // التحقق من وجود التوكن
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No token found, redirecting to login');
        window.location.href = './login.html';
        return;
    }

    // التحقق من وجود بيانات المستخدم
    const userData = localStorage.getItem('user');
    if (!userData) {
        console.warn('No user data found, redirecting to login');
        utils.logout();
        return;
    }

    try {
        // عرض البيانات
        const user = JSON.parse(userData);
        displayUserData(user);
    } catch (error) {
        console.error('Error parsing user data:', error);
        utils.logout();
    }
});

function displayUserData(user) {
    console.log('Displaying user data:', user);
    // إخفاء شاشة التحميل وإظهار المحتوى
    document.getElementById('loading').style.display = 'none';
    document.getElementById('profileContent').style.display = 'block';

    // عرض البيانات الأساسية
    document.getElementById('userName').textContent = user.name || 'غير متوفر';
    document.getElementById('userEmail').textContent = user.email || 'غير متوفر';
    
    // عرض حالة تفعيل البريد
    const emailStatusElement = document.getElementById('emailStatus');
    emailStatusElement.textContent = user.isEmailVerified ? "مفعل" : "غير مفعل";
    emailStatusElement.classList.add(user.isEmailVerified ? 'verified' : 'not-verified');
}

// إضافة مستمع لزر تسجيل الخروج
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    utils.logout();
}); 