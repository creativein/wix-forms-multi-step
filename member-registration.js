import { FORM_STATES } from 'public/formStates.js'
import { autorun, observable } from 'mobx';
import { verifySalesRep, getMembershipCost } from 'backend/mebership.jsw';

const state = observable({
    formState: FORM_STATES.BASIC_INFO,
    formError: false,
    formData: {
        applicationNo: '',
        salesRepId: '',
        applicationType: '', // new | renewal | addon
        existingMemberNumber: '',
        membershipType: '',
        group: '',
        applicationDate: '',
        applicationEffectiveDate: '',
        primaryMember: {
            firstName: '',
            mi: '',
            lastName: ''
        },
        residenceAddress: {
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: ''
        },
        mailingAddress: {
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: ''
        },
        companions: [],
        billingCycle: '',
        payment: {
            method: '',
            enrollmentFee: '$0',
            membershipFee: '$0',
            memberCheckNo: '',
            checkDate: '',
            name: ''
        },
        additionalInfo: '',
    }
});

const TABS_CONTROLLER = {
    primaryColor: `#000000`,
    activeColor: `#FF4040`,
    tabs: ["setupTab", "membersTab", "billingTab", "reviewTab", "submitTab"],
    init: () => {
        /** Click Handlers for Tabs */
        const selector = TABS_CONTROLLER.tabs.reduce((a, c) => a + `#${c},`, "");
        $w(selector).onClick(event => {
            // TABS_CONTROLLER.tabs.forEach(e => $w("#" + e).style.backgroundColor = TABS_CONTROLLER.primaryColor);
            // $w("#" + event.target.id).style.backgroundColor = TABS_CONTROLLER.activeColor;
        })
        /*
        $w("#setupTab").onClick(() => {
            state.formState = FORM_STATES.BASIC_INFO;
        });
        $w("#membersTab").onClick(() => {
            state.formState = FORM_STATES.FRESH_PRIMARY_MEMBER_INFO;
        });
        $w("#billingTab").onClick(() => {
            state.formState = FORM_STATES.BILLING_INFO;
        });
        $w("#reviewTab").onClick(() => {
            state.formState = FORM_STATES.REVIEW;
        });
        */
    }
}

$w.onReady(function () {

    autorun(() => {
        $w(`#newMemberRegistrationBox`).changeState(state.formState);
        $w('#errorMessage').collapse();
        $w("#anchor1").scrollTo();
    })

    // ADD COMPANION BUTTON

    $w("#buttonAddCompanions").onClick(function () {
        state.formState = FORM_STATES.COMPANION_MEMBERS_INFO;
        setPrimaryInfo();
        $w("#anchor1").scrollTo();

    });

    $w("#appType").onChange(function () {
        let memberNumber = $w("#appType").value;

        if (memberNumber != "new") {
            $w("#inputMemberNumber").expand();
            $w("#inputMemberNumber").value = '';
            $w("#inputMemberNumber").required = true;
            $w("#inputMemberNumber").resetValidityIndication();

        } else {
            $w("#inputMemberNumber").collapse();
            $w("#inputMemberNumber").value = '';
            $w("#inputMemberNumber").required = false;
            $w("#inputMemberNumber").resetValidityIndication();
        }
    });

    TABS_CONTROLLER.init();

});

export function checkboxMailingAddress_change(event) {
    let isChecked = event.target.checked;
    if (isChecked) {
        expandMailingInputs();
    } else {
        collapseMailingInputs();
    }
}

export function collapseMailingInputs() {
    $w('#mailingAddress1').collapse();
    $w('#mailingAddress2').collapse();
    $w('#mailingAddress2').enable();
    $w('#mailingCity').collapse();
    $w('#mailingCity').enable();
    $w('#mailingState').collapse();
    $w('#mailingState').enable();
    $w('#mailingZIP').collapse();
    $w('#mailingZIP').enable();
}

export function expandMailingInputs() {
    $w('#mailingAddress1').expand();
    $w('#mailingAddress1').enable();
    $w('#mailingAddress2').expand();
    $w('#mailingCity').expand();
    $w('#mailingState').expand();
    $w('#mailingZIP').expand();
    $w('#mailingAddress2').enable();
    $w('#mailingCity').enable();
    $w('#mailingState').enable();
    $w('#mailingState').enable();
    $w('#mailingZIP').enable();
}

// Companion Step Add Button Listener
export function onAddCompanionClick(event) {
    const id = parseInt(event.target.id.match(/(\d+)/)[0], 10);
    const nextAddBtnID = `#buttonAddComp${(id + 1)}`;
    const prevRevertBtnID = `#buttonRevertComp${(id - 1)}`;
    const nextRevertBtnID = `#buttonRevertComp${(id)}`;
    console.log(nextAddBtnID, prevRevertBtnID);
    $w(`#textCompanion${id}`).expand();
    $w(`#inputCompanion${id}First`).expand();
    $w(`#inputCompanion${id}MI`).expand();
    $w(`#inputCompanion${id}Last`).expand();
    if (id !== 10)
        $w(nextAddBtnID).expand();
    $w(prevRevertBtnID).expand();
    $w(nextRevertBtnID).expand();
}

// Companion Revert Button Listener
export function onRevetCompanionClick(event) {
    const id = parseInt(event.target.id.match(/(\d+)/)[0], 10);
    $w(`#textCompanion${id}`).collapse();
    $w(`#inputCompanion${id}First`).value = "";
    $w(`#inputCompanion${id}First`).collapse();
    $w(`#inputCompanion${id}First`).resetValidityIndication();
    $w(`#inputCompanion${id}MI`).value = "";
    $w(`#inputCompanion${id}MI`).collapse();
    $w(`#inputCompanion${id}MI`).resetValidityIndication();
    $w(`#inputCompanion${id}Last`).value = "";
    $w(`#inputCompanion${id}Last`).collapse();
    $w(`#inputCompanion${id}Last`).resetValidityIndication();
    // collapse btns
    $w(`#buttonRevertComp${id}`).collapse();
    if (id !== 10)
        $w(`#buttonAddComp${id+1}`).collapse();
}

export function radioMemberPaymentType_change(event) {
    console.log(event.target.value);
    const type = event.target.value;
    if (type == 'Check') {
        showCheckInputs();
    } else {
        hideCheckInputs();
    }

}

export function showCheckInputs() {
    $w('#inputMemberCheckNumber').expand();
    $w('#dateMemberCheckDate').expand();
    $w('#inputName').expand();
    resetValidationIndication();
}

export function hideCheckInputs() {
    $w('#inputMemberCheckNumber').collapse();
    $w('#dateMemberCheckDate').collapse();
    $w('#inputName').collapse();
    resetValidationIndication();
}

export function resetValidationIndication() {
    $w('#inputMemberCheckNumber').value = '';
    $w('#inputName').value = '';
    $w('#inputMemberCheckNumber').resetValidityIndication();
    $w('#dateMemberCheckDate').resetValidityIndication();
    $w('#inputName').resetValidityIndication();
}

export function basicInfoContinue_click(event) {
    state.formData.applicationNo = $w('#appNumber').value.trim();
    state.formData.salesRepId = $w('#salesRepId').value.trim();
    state.formData.applicationType = $w('#appType').value.trim();
    state.formData.membershipType = $w('#membershipType').value.trim();
    state.formData.applicationDate = $w('#appDate').value;
    state.formData.applicationEffectiveDate = $w('#appEffectiveDate').value;
    state.formData.existingMemberNumber = $w('#inputMemberNumber').value.trim();

    // validation check
    const isValid = validateApplicationInfo();
    if (isValid) {
        state.formState = FORM_STATES.FRESH_PRIMARY_MEMBER_INFO;
    } else {
        $w('#errorMessage').expand();
    }
    console.log('State', state);
}

export function primaryInfoContinueClick_click(event) {
    setPrimaryInfo();
    state.formState = FORM_STATES.BILLING_INFO;
}

export function setPrimaryInfo() {
    state.formData.primaryMember = {
        firstName: $w('#primaryFirst').value.trim(),
        mi: $w('#primaryMI').value.trim(),
        lastName: $w('#primaryLast').value.trim()
    }
    state.formData.residenceAddress = {
        address1: $w('#primaryAddress1').value.trim(),
        address2: $w('#primaryAddress2').value.trim(),
        city: $w('#primaryCity').value.trim(),
        state: $w('#primaryState').value.trim(),
        zip: $w('#primaryZIP').value.trim()
    }
    state.formData.mailingAddress = {
        address1: $w('#mailingAddress1').value.trim(),
        address2: $w('#mailingAddress2').value.trim(),
        city: $w('#mailingCity').value.trim(),
        state: $w('#mailingState').value.trim(),
        zip: $w('#mailingZIP').value.trim()
    }
    console.log('State', state);
}

export function primaryInfoBackBtn_click(event) {
    state.formState = FORM_STATES.BASIC_INFO;
}

export function companionContinueBtn_click(event) {
    addCompanions();
    state.formState = FORM_STATES.BILLING_INFO;
}

export function companionBackBtn_click(event) {
    state.formState = FORM_STATES.FRESH_PRIMARY_MEMBER_INFO;
}

export async function billingContinnueBtn_click(event) {
    state.formData.billingCycle = $w('#billingCycleDD').value.trim();
    state.formData.payment = {
        method: $w('#radioMemberPaymentType').value.trim(),
        memberCheckNo: $w('#inputMemberCheckNumber').value.trim(),
        checkDate: $w('#dateMemberCheckDate').value,
        name: $w('#inputName').value.trim()
    }
    state.formData.additionalInfo = $w('#additionalInfoTxt').value.trim();
    const membershipCost = await getMembershipCost(state.formData);
    console.log('Cost', membershipCost);
    console.log('State', state);
    state.formState = FORM_STATES.REVIEW
    setTimeout(() => {
        const data = state.formData;
        $w('#reviewWindow').postMessage(JSON.stringify(data));
    }, 1000);
}

export function billingBackBtn_click(event) {
    state.formState = FORM_STATES.FRESH_PRIMARY_MEMBER_INFO
}

export function addCompanions() {
    state.formData.companions = [];
    for (let i = 0; i < 10; i++) {
        const id = i + 1;
        const firstName = $w(`#inputCompanion${id}First`).value?.trim();
        const mi = $w(`#inputCompanion${id}MI`).value?.trim();
        const lastName = $w(`#inputCompanion${id}Last`).value?.trim();
        if (firstName !== '' && lastName !== '') {
            state.formData.companions.push({
                firstName,
                mi,
                lastName
            })
        }
    }
}

export function submitForm() {
    const data = {
        title: state.formData.primaryMember.firstName, // Text
        applicationNumber: state.formData.applicationNo, // Text
        tmcSalesRepresentative: state.formData.salesRepId, // Text
        applicationType: state.formData.applicationType, // Text
        membershipLevel: state.formData.membershipType, // Text
        primaryMemberFirstName: state.formData.primaryMember.firstName, // Text
        primaryMemberMi: state.formData.primaryMember.mi, // Text
        primaryMemberLastName: state.formData.primaryMember.lastName, // Text
        primaryMemberPrimaryAddress1: state.formData.residenceAddress.address1, // Text
        primaryMemberPrimaryAddress2: state.formData.residenceAddress.address2, // Text
        primaryAddressCity: state.formData.residenceAddress.city, // Text
        primaryAddressState: state.formData.residenceAddress.state,
        primaryAddressZip: state.formData.residenceAddress.zip,
        secondaryAddress1: state.formData.mailingAddress.address1,
        secondaryAddress2: state.formData.mailingAddress.address2,
        mailingAddressCity: state.formData.mailingAddress.city,
        mailingAddressState: state.formData.mailingAddress.state,
        mailingAddressZip: state.formData.mailingAddress.zip,
        existingMemberNumber: state.formData.existingMemberNumber,
        companions: state.formData.companions,
        billingCycle: state.formData.billingCycle,
        paymentMethod: state.formData.payment.method,
        paymentInfo: {},
        additionalInfo: state.formData.additionalInfo,
        applicationDate: state.formData.applicationDate,
        applicationEffectiveDate: state.formData.applicationEffectiveDate
    };
    if (data.paymentMethod == 'Check') {
        data.paymentInfo = {
            memberCheckNo: state.formData.payment.memberCheckNo,
            checkDate: state.formData.payment.checkDate,
            name: state.formData.payment.name
        }
    }
    $w('#datasetNewMemberRegistration').setFieldValues(data);

    if (!state.formError) {
        $w('#datasetNewMemberRegistration').save()
            .then((item) => {
                console.log('Saved Item');
                console.log(item);
            })
            .catch((err) => {
                console.log('Save Error', err);
                $w('#reviewWindow').postMessage(JSON.stringify({
                    action: 'alert',
                    message: err
                }));
            });
    } else {
        console.log(`Form Can't Be Submitted, as it has some validation issue`);
        $w('#reviewWindow').postMessage(JSON.stringify({
            action: 'alert',
            message: `Form Can't Be Submitted, as it has some validation issue`
        }));
    }

}

export function reviewSubmit_click(event) {
    $w('#reviewWindow').postMessage(JSON.stringify({
        action: 'submit'
    }));
    submitForm();
}

export function reviewBackBtn_click(event) {
    state.formState = FORM_STATES.BILLING_INFO;
}

export function validateApplicationInfo() {
    let isValid = false;
    if (state.formData.applicationNo.trim() !== '' && state.formData.salesRepId.trim() !== '' && state.formData.applicationType.trim() !== '' &&
        state.formData.membershipType.trim() !== '') {
            console.log('condition 1');
        isValid = true;
        if (state.formData.applicationType.toLowerCase().trim() !== 'new' && state.formData.existingMemberNumber.trim() !== '') {
            console.log('condition 2');
            isValid = true;
        } else if (state.formData.applicationType.toLowerCase().trim() == 'new' && state.formData.existingMemberNumber.trim() == '') {
            console.log('conditino 3');
            isValid = true;
        } else {
            console.log('condition 4');
            isValid = false;
        }
    }
    return isValid;
}

// validation
const validateSalesRep = (salesRepElementId) => async (value, reject) => {
    let salesRepElement = $w(salesRepElementId);
    const data = await verifySalesRep(value);
    console.log('data', data.length);
    if (data.length > 0) {
        salesRepElement.validity.valid = true;
        salesRepElement.resetValidityIndication();
        return;
    } else {
        // error
        salesRepElement.validity.valid = false;
        salesRepElement.updateValidityIndication();
        reject("Sales Rep Id not found");
    }
};

$w("#salesRepId").onCustomValidation(validateSalesRep("#salesRepId"));
