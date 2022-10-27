const test = {
    ga: "",
    ga_4: "G-P4R31P5B1T",
    timer: "1"
   

};


const prod = {
    ga: "",
    ga_4: "G-P4R31P5B1T",
    timer: "1"
   
};

const config = process.env.REACT_APP_ENVIRONMENT === 'production'
    ? prod
    : test;

export default {
    // Add common config values here
    MAX_ATTACHMENT_SIZE: 5000000,
    ...config
};