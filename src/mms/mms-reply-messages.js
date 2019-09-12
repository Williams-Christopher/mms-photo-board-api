const support_email = `MMSPhotoBoard@chriswillia.ms`;
const webapp_url = `https://mms-photo-board.cwilliams.now.sh`

module.exports = {
    verify_success: `Thank you. Your account is now verified.`,
    verify_failure: `I couldn't verify your number. Please email ${support_email} for help.`,
    verify_decline: `Sorry you're leaving. :( Please sign up again later and feel free to email ${support_email} with feedback.`,
    verify_already_complete: `Your phone is already verified. You can submit photos or email ${support_email} for help.`,
    verify_failure_bad_number: `This phone number is not recognized. See ${webapp_url} to sign up or email ${support_email} for help.`,
    submission_success: `Thank you! Your submission was received and sucessfully posted!`,
    submission_failure: `There was an error posting your submission. Please try again later or email ${support_email} for help.`,
    submission_failure_unverified: `Only verified phones may make submissions. Reply YES to verify your account or NO to delete your account.`,
    submission_failure_bad_number: `This phone number is not recognized. See ${webapp_url} to sign up or email ${support_email} for help.`,
    general_failure: `I'm not sure what you're asking me to do. Please try again or email ${support_email} for help.`
};
