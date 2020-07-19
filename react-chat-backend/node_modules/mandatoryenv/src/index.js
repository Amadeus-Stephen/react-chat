module.exports = {
    /**
     *  Load all your enviroment variables, pass an array for the ones that are mandatory
     * 
     * @param {Array<string>} variables default: [], An array of strings containting the enviroment variable names you need
     * @param {boolean} silent default: false, if set to true no errors will be thrown but only console logged
     */
    load(variables = [], silent = false) {
        // Loads .env variables to proccess.env
        require('dotenv').config();
        

        // Check if all needed enviroment variables are available
        variables.forEach(variable => {
            if ( !silent && !Reflect.has(process.env, variable) ){
                throw new Error(`❌   _No ${variable} found in Enviroment Variables`);
            }
        });
    
        global.env = process.env;
        return process.env;
    }
}