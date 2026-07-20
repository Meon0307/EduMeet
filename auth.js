document.addEventListener("DOMContentLoaded", function () {

    if (window.lucide) {
        lucide.createIcons();
    }


    initialiseRoleTabs();
    initialisePasswordButtons();
    initialisePasswordRequirements();
    initialiseLoginForm();
    initialiseSignupForm();

});


function initialiseRoleTabs() {

    const tabs = document.querySelectorAll(".role-tab");

    if (tabs.length === 0) {
        return;
    }


    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            tabs.forEach(function (currentTab) {
                currentTab.classList.remove("active");
            });

            tab.classList.add("active");


            const selectedRole = tab.dataset.role;

            updateSelectedRole(selectedRole);

        });

    });

}


function updateSelectedRole(role) {

    const loginRole = document.getElementById("loginRole");
    const signupRole = document.getElementById("signupRole");

    const loginIdentityLabel =
        document.getElementById("loginIdentityLabel");

    const loginButtonText =
        document.getElementById("loginButtonText");

    const signupButtonText =
        document.getElementById("signupButtonText");

    const studentFields =
        document.getElementById("studentFields");

    const lecturerFields =
        document.getElementById("lecturerFields");


    if (loginRole) {

        loginRole.value = role;

        loginIdentityLabel.textContent =
            role === "student"
                ? "Student Email"
                : "Lecturer Email";

        loginButtonText.textContent =
            role === "student"
                ? "Log In as Student"
                : "Log In as Lecturer";

    }


    if (signupRole) {

        signupRole.value = role;

        signupButtonText.textContent =
            role === "student"
                ? "Create Student Account"
                : "Create Lecturer Account";


        if (role === "student") {

            studentFields.classList.remove("hidden");
            lecturerFields.classList.add("hidden");

        } else {

            studentFields.classList.add("hidden");
            lecturerFields.classList.remove("hidden");

        }

    }


    clearAllErrors();

}


function initialisePasswordButtons() {

    const passwordButtons =
        document.querySelectorAll(".password-toggle");


    passwordButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const inputId = button.dataset.passwordTarget;

            const passwordInput =
                document.getElementById(inputId);


            if (!passwordInput) {
                return;
            }


            const isPassword =
                passwordInput.type === "password";


            passwordInput.type =
                isPassword ? "text" : "password";


            button.innerHTML =
                isPassword
                    ? '<i data-lucide="eye-off"></i>'
                    : '<i data-lucide="eye"></i>';


            if (window.lucide) {
                lucide.createIcons();
            }

        });

    });

}


function initialisePasswordRequirements() {

    const passwordInput =
        document.getElementById("signupPassword");


    if (!passwordInput) {
        return;
    }


    passwordInput.addEventListener("input", function () {

        const password = passwordInput.value;

        updateRequirement(
            "lengthRequirement",
            password.length >= 8
        );

        updateRequirement(
            "numberRequirement",
            /\d/.test(password)
        );

        updateRequirement(
            "letterRequirement",
            /[A-Za-z]/.test(password)
        );

    });

}


function updateRequirement(elementId, isValid) {

    const requirement =
        document.getElementById(elementId);


    if (!requirement) {
        return;
    }


    requirement.classList.toggle(
        "valid",
        isValid
    );

}


function initialiseLoginForm() {

    const form =
        document.getElementById("loginForm");


    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        clearAllErrors();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const role =
            document.getElementById("loginRole").value;

        let isValid = true;


        if (!validateEmail(email)) {

            showFieldError(
                "loginEmail",
                "loginEmailError",
                "Enter a valid email address."
            );

            isValid = false;

        }


        if (password.length === 0) {

            showFieldError(
                "loginPassword",
                "loginPasswordError",
                "Password is required."
            );

            isValid = false;

        }


        if (!isValid) {
            return;
        }


        showFormStatus(
            "loginStatus",
            "Form validated. Firebase login can now be connected.",
            "success"
        );


        console.log("Login information:", {
            role: role,
            email: email
        });

    });

}


function initialiseSignupForm() {

    const form =
        document.getElementById("signupForm");


    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        clearAllErrors();


        const role =
            document.getElementById("signupRole").value;

        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const agreeTerms =
            document.getElementById("agreeTerms").checked;

        let isValid = true;


        if (firstName.length < 2) {

            showFieldError(
                "firstName",
                "firstNameError",
                "Enter your first name."
            );

            isValid = false;

        }


        if (lastName.length < 2) {

            showFieldError(
                "lastName",
                "lastNameError",
                "Enter your last name."
            );

            isValid = false;

        }


        if (!validateEmail(email)) {

            showFieldError(
                "signupEmail",
                "signupEmailError",
                "Enter a valid email address."
            );

            isValid = false;

        }


        if (role === "student") {

            isValid =
                validateStudentFields() && isValid;

        } else {

            isValid =
                validateLecturerFields() && isValid;

        }


        if (!validatePassword(password)) {

            showFieldError(
                "signupPassword",
                "signupPasswordError",
                "Password must contain at least 8 characters, one letter and one number."
            );

            isValid = false;

        }


        if (confirmPassword !== password) {

            showFieldError(
                "confirmPassword",
                "confirmPasswordError",
                "Passwords do not match."
            );

            isValid = false;

        }


        if (!agreeTerms) {

            document.getElementById(
                "agreeTermsError"
            ).textContent =
                "You must agree to the Terms and Conditions.";

            isValid = false;

        }


        if (!isValid) {
            return;
        }


        const accountInformation =
            collectSignupInformation(role);


        showFormStatus(
            "signupStatus",
            role === "student"
                ? "Student registration form validated successfully."
                : "Lecturer registration form validated successfully.",
            "success"
        );


        console.log(
            "Registration information:",
            accountInformation
        );

    });

}


function validateStudentFields() {

    const studentNumber =
        document.getElementById("studentNumber").value.trim();

    const programme =
        document.getElementById("programme").value;

    const semester =
        document.getElementById("semester").value;

    let isValid = true;


    if (studentNumber.length < 5) {

        showFieldError(
            "studentNumber",
            "studentNumberError",
            "Enter a valid student number."
        );

        isValid = false;

    }


    if (programme === "") {

        showFieldError(
            "programme",
            "programmeError",
            "Select your programme."
        );

        isValid = false;

    }


    if (semester === "") {

        showFieldError(
            "semester",
            "semesterError",
            "Select your current semester."
        );

        isValid = false;

    }


    return isValid;

}


function validateLecturerFields() {

    const staffNumber =
        document.getElementById("staffNumber").value.trim();

    const department =
        document.getElementById("department").value;

    const officeLocation =
        document.getElementById("officeLocation").value.trim();

    const locationMode =
        document.getElementById("locationMode").value;

    let isValid = true;


    if (staffNumber.length < 3) {

        showFieldError(
            "staffNumber",
            "staffNumberError",
            "Enter a valid staff number."
        );

        isValid = false;

    }


    if (department === "") {

        showFieldError(
            "department",
            "departmentError",
            "Select your department."
        );

        isValid = false;

    }


    if (officeLocation.length < 2) {

        showFieldError(
            "officeLocation",
            "officeLocationError",
            "Enter your office location."
        );

        isValid = false;

    }


    if (locationMode === "") {

        showFieldError(
            "locationMode",
            "locationModeError",
            "Select a consultation mode."
        );

        isValid = false;

    }


    return isValid;

}


function collectSignupInformation(role) {

    const userInformation = {

        firstName:
            document.getElementById("firstName").value.trim(),

        lastName:
            document.getElementById("lastName").value.trim(),

        email:
            document.getElementById("signupEmail").value.trim(),

        phoneNumber:
            document.getElementById("phoneNumber").value.trim(),

        role: role

    };


    if (role === "student") {

        userInformation.student = {

            studentNumber:
                document.getElementById(
                    "studentNumber"
                ).value.trim(),

            programme:
                document.getElementById(
                    "programme"
                ).value,

            semester:
                document.getElementById(
                    "semester"
                ).value

        };

    } else {

        userInformation.lecturer = {

            staffNumber:
                document.getElementById(
                    "staffNumber"
                ).value.trim(),

            department:
                document.getElementById(
                    "department"
                ).value,

            officeLocation:
                document.getElementById(
                    "officeLocation"
                ).value.trim(),

            locationMode:
                document.getElementById(
                    "locationMode"
                ).value

        };

    }


    return userInformation;

}


function validateEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailPattern.test(email);

}


function validatePassword(password) {

    return (
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&
        /\d/.test(password)
    );

}


function showFieldError(
    fieldId,
    errorId,
    message
) {

    const field =
        document.getElementById(fieldId);

    const error =
        document.getElementById(errorId);


    if (field) {

        const wrapper =
            field.closest(".input-wrapper");

        if (wrapper) {
            wrapper.classList.add("input-error");
        }

    }


    if (error) {
        error.textContent = message;
    }

}


function clearAllErrors() {

    document
        .querySelectorAll(".error-message")
        .forEach(function (error) {

            error.textContent = "";

        });


    document
        .querySelectorAll(".input-wrapper")
        .forEach(function (wrapper) {

            wrapper.classList.remove("input-error");

        });


    document
        .querySelectorAll(".form-status")
        .forEach(function (status) {

            status.textContent = "";
            status.className = "form-status";

        });

}


function showFormStatus(
    statusId,
    message,
    type
) {

    const status =
        document.getElementById(statusId);


    if (!status) {
        return;
    }


    status.textContent = message;
    status.className =
        "form-status " + type;

}