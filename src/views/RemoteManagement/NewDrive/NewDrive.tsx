import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, FormGroup, Label } from "reactstrap";
// import {config} from "./config.js";
import NewDriveAuthModal from "../../Base/NewDriveAuthModal";
import axiosInstance from "../../../utils/API/API";
import {
  findFromConfig,
  isEmpty,
  validateDriveName,
  validateDuration,
  validateInt,
  validateSizeSuffix,
} from "../../../utils/Tools";
import { toast } from "react-toastify";
import { NEW_DRIVE_CONFIG_REFRESH_TIMEOUT } from "../../../utils/Constants";
import ErrorBoundary from "../../../ErrorHandling/ErrorBoundary";
import urls from "../../../utils/API/endpoint";
import { getAllProviders } from "rclone-api";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import cn from "classnames";
import ProviderAutoSuggest from "./ProviderAutoSuggest";
import { Provider } from "../../../@types/provider";

/**
 * Returns a component with set of input, error for the drivePrefix.
 * The input type changes based on config.Options.Type parameter. see code for details.
 * @param drivePrefix   {string}    Name of the remote in the config.
 * @param loadAdvanced  {boolean}   Load or skip the advanced options from the config options.
 * @param changeHandler {function}  This function is called once the value changes
 * @param currentValues {$ObjMap}   This map denotes current updated values for the parameters.
 * @param isValidMap    {$ObjMap}   This map denotes whether the parameter value is valid. This should be set by the changeHandler.
 * @param errorsMap     {$ObjMap}   This map contains string errors of each parameters.
 * @param config        {$ObjMap}   This map contains the actual parameter list and Options for all the providers.
 * @returns             {Array|*}   JSX array with parameter formGroups.
 * @constructor
 */
function DriveParameters({
  drivePrefix,
  loadAdvanced,
  changeHandler,
  currentValues,
  isValidMap,
  errorsMap,
  config,
}) {
  const currentProvider = findFromConfig(config, drivePrefix);
  const inputsMap = currentProvider.Options;

  /*
  {
    "Advanced": true,
    "Default": -1,
    "DefaultStr": "off",
    "Help": "If Object's are greater, use drive v2 API to download.",
    "Hide": 0,
    "IsPassword": false,
    "Name": "v2_download_min_size",
    "NoPrefix": false,
    "Provider": "",
    "Required": false,
    "ShortOpt": "",
    "Type": "SizeSuffix",
    "Value": null,
    "ValueStr": "off"
  }
  */

  return inputsMap.map((attr, idx) => {
    if (
      attr.Hide === 0 &&
      ((loadAdvanced && attr.Advanced) || (!loadAdvanced && !attr.Advanced))
    ) {
      const labelValue = `${attr.Help}`;
      const requiredValue = attr.Required ? (
        <i className={"text-red"}>*</i>
      ) : null;

      const hasExamples = !isEmpty(attr.Examples);
      let examplesMap = null;

      let inputType = "";
      if (attr.IsPassword) {
        inputType = "password";
      } else if (hasExamples) {
        inputType = "text";
        // examplesMap = attr.Examples.map((ex1, id1) => {
        //     return (<option key={"option" + id1} value={ex1.Value}>{ex1.Help}</option>);
        // })
      } else if (attr.Type === "bool") {
        inputType = "select";
        //@ts-ignore
        examplesMap = [
          <option key={1} value="true">
            Yes
          </option>,
          <option key={2} value="false">
            No
          </option>,
        ];
      } else {
        // TODO: Write logic for SizeSuffix, Duration, int
        if (attr.Type === "int") {
          inputType = "number";
        } else {
          inputType = "text";
        }
      }
      return (
        <div key={idx}>
          <label htmlFor={attr.Name}>
            {labelValue}
            {requiredValue}
          </label>
          <div>
            <input
              type={inputType}
              value={currentValues[attr.Name]}
              name={attr.Name}
              id={attr.Name}
              onChange={changeHandler}
              required={attr.Required}
              children={examplesMap}
            />

            <p>{errorsMap[attr.Name]}</p>
          </div>
        </div>
      );
    } else {
      return null;
    }
  });
}

// function DriveTypes({config}) {
//     // console.log(config);
//     let configMap = config.map((drive, idx) => (
//         <option key={drive.Prefix} value={idx}>{drive.Description}</option>
//     ));
//     return configMap;
// }

function NewDrive() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [drive, setDrive] = useState({
    name: "",
    nameIsEditable: true,
    nameIsValid: false,
  });

  const [colRconfig, setColRconfig] = useState(true);
  const [colSetup, setColSetup] = useState(false);
  const [colAdvanced, setColAdvanced] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [formValuesValid, setFormValuesValid] = useState({});
  const [required, setRequired] = useState({});
  const [authModalIsVisible, setAuthModalIsVisible] = useState(false);
  const [drivePrefix, setDrivePrefix] = useState("");
  const [formErrors, setFormErrors] = useState({ driveName: "" });
  const [optionTypes, setOptionTypes] = useState({});
  const [isValid, setIsValid] = useState({});
  const [currentStepNumber, setCurrentStepNumber] = useState(0);
  const [configCheckInterval, setConfigCheckInterval] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getAllProviders().then((data) => {
      setProviders(data.providers);
      console.log(data.providers);
    });

    axiosInstance
      .post(urls.getConfigForRemote, { name: drivePrefix })
      .then((res) => {
        console.log(res);

        setFormValues((prevState) => ({
          ...prevState,
          ...res.data,
        }));
      });
  }, []);

  // Returns true or false based on whether the config is created
  const checkConfigStatus = async () => {
    try {
      let res = await axiosInstance.post(urls.getConfigForRemote, {
        name: drive.name,
      });
      // console.log(res);

      if (!isEmpty(res.data)) {
        // Config is created, clear the interval and hide modal
        // clearInterval(configCheckInterval);
        toggleAuthModal();
        navigate("/dashboard");
      }
    } catch (e) {
      // console.log(`Error occurred while checking for config: ${e}`);
      toast.error(`Error creating config. ${e}`, {
        autoClose: false,
      });
    }
  };

  /**
   * Handle inoit change and set appropriate errors.
   * @param e
   */
  const handleInputChange = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value;
    const inputType = optionTypes[inputName];
    setFormValues({
      ...formValues,
      [inputName]: inputValue,
    });
    let validateResult = true;
    let error = "";
    if (inputType === "SizeSuffix") {
      validateResult = validateSizeSuffix(inputValue);
      if (!validateResult) {
        error =
          "The valid input is size( off | {unit}{metric} eg: 10G, 100M, 10G100M etc.)";
      }
    } else if (inputType === "Duration") {
      validateResult = validateDuration(inputValue);
      if (!validateResult) {
        error =
          "The valid input is time ({unit}{metric} eg: 10ms, 100m, 10h15ms etc.)";
      }
    } else if (inputType === "int") {
      validateResult = validateInt(inputValue);
      if (!validateResult) {
        error = "The valid input is int (100,200,300 etc)";
      }
    }

    if (required[inputName] && (!inputValue || inputValue === "")) {
      validateResult = false;
      if (!validateResult) {
        error += " This field is required";
      }
    }

    setIsValid({
      ...isValid,
      [inputName]: validateResult,
    });
    setFormErrors({
      ...formErrors,
      [inputName]: error,
    });
  };

  /**
   * Update the driveType and then load the equivalent input parameters for that drive.
   * @param e     {$ObjMap} Event to be handled.
   * @param newValue  {string} new Value of the drive type.
   */
  const changeDriveType = (e) => {
    let val = e.target.value;

    let availableOptions = {};
    let optionTypes = {};
    let isValid = {};
    let formErrors = {};
    let required = {};
    // let drivePrefix = "";
    // console.log("driveType change", val);
    if (val !== undefined && val !== "") {
      const currentConfig = findFromConfig(providers, val);
      if (currentConfig !== undefined) {
        currentConfig.Options.forEach((item) => {
          const { DefaultStr, Type, Name, Required, Hide } = item;
          if (Hide === 0) {
            availableOptions[Name] = DefaultStr;
            optionTypes[Name] = Type;
            required[Name] = Required;

            isValid[Name] = !(Required && (!DefaultStr || DefaultStr === ""));

            formErrors[Name] = "";
          }
        });
      }

      setDrivePrefix(val);

      setFormValues(availableOptions);
      setOptionTypes(optionTypes);

      setIsValid(isValid);
      //@ts-ignore
      setFormErrors(formErrors);
      setRequired(required);
    } else {
      setDrivePrefix(val);
    }
  };

  /**
   * Open second step of setting up the drive and scroll into view.
   */
  const openSetupDrive = (e) => {
    if (e) e.preventDefault();
    setColSetup(true);
    // this.setupDriveDiv.scrollIntoView({behavior: "smooth"});
  };

  /**
   *  toggle the step 3: advanced options
   */
  const editAdvancedOptions = (e) => {
    setAdvancedOptions(!advancedOptions);
  };

  /**
   * Validate the form and set the appropriate errors in the state.
   * @returns {boolean}
   */
  const validateForm = () => {
    let flag = true;

    if (!drive.nameIsValid) {
      flag = false;
    }
    if (drivePrefix === "") {
      flag = false;
    }

    /*Check for validations based on inputType*/
    for (const [key, value] of Object.entries(isValid)) {
      if (!key || !value) {
        flag = false;
        break;
      }
    }

    return flag;
  };

  /**
   *  Show or hide the auth modal.
   */
  const toggleAuthModal = () => {
    setAuthModalIsVisible(!authModalIsVisible);
  };

  /**
   *  Show or hide the authentication modal and start timer for checking if the new config is created.
   */
  const startAuthentication = () => {
    toggleAuthModal();
    // Check every second if the config is created
    if (configCheckInterval === null) {
      setConfigCheckInterval(
        //@ts-ignore
        setInterval(checkConfigStatus, NEW_DRIVE_CONFIG_REFRESH_TIMEOUT)
      );
    } else {
      console.error("Interval already running. Should not start a new one");
    }
  };

  /**
   *  Called when the config is successfully created. Clears the timout and hides the authentication modal.
   */
  const stopAuthentication = () => {
    setAuthModalIsVisible(false);

    //@ts-ignore
    clearInterval(configCheckInterval);
  };

  /**
   * Called when form action submit is to be handled.
   * Validate form and submit request.
   * */
  const handleSubmit = async (e) => {
    e && e.preventDefault();
    // console.log("Submitted form");

    if (validateForm()) {
      if (drivePrefix !== undefined && drivePrefix !== "") {
        const currentProvider = findFromConfig(providers, drivePrefix);
        if (currentProvider !== undefined) {
          const defaults = currentProvider.Options;

          // console.log(config, formValues, defaults);

          let finalParameterValues = {};

          for (const [key, value] of Object.entries(formValues)) {
            if (key === "token") {
              finalParameterValues[key] = value;
              continue;
            }
            const defaultValueObj = defaults.find((ele, idx, array) => {
              // console.log(key, ele.Name, key === ele.Name);
              return key === ele.Name;
            });
            if (defaultValueObj) {
              const { DefaultStr } = defaultValueObj;
              if (value !== DefaultStr) {
                // console.log(`${value} !== ${DefaultStr}`);
                finalParameterValues[key] = value;
              }
            }
          }

          let data = {
            parameters: finalParameterValues,

            name: drive.name,
            type: drivePrefix,
          };

          // console.log("Validated form");
          startAuthentication();
          try {
            // todo: react router useParams?
            //const { drivePrefix } = this.props.match.params;
            const drivePrefix = false;

            if (!drivePrefix) {
              await axiosInstance.post(urls.createConfig, data);
              toast.info("Config created");
            } else {
              await axiosInstance.post(urls.updateConfig, data);
              toast.info("Config Updated");
            }
          } catch (err) {
            toast.error(`Error creating config. ${err}`, {
              autoClose: false,
            });
            stopAuthentication();
          }
        }
      }
    } else {
      if (!colSetup) {
        openSetupDrive(null);
      }

      if (advancedOptions && !colAdvanced) {
        openAdvancedSettings();
      }
      toast.warn(`Check for errors before submitting.`, {
        autoClose: false,
      });
    }
  };

  /**
   * Clears the entire form.
   * Clearing the driveName and drivePrefix automatically clears the inputs as well.
   * */
  const clearForm = () => {
    setDrive({
      name: "",
      nameIsEditable: true,
      nameIsValid: false,
    });
    setDrivePrefix("");
  };

  /**
   * Change the name of the drive. Check if it already exists, if not, allow to be changes, else set error.
   * */
  const changeName = (e) => {
    const value = e.target.value;
    if (
      drive.nameIsEditable &&
      validateDriveName(value) &&
      value !== undefined &&
      value !== ""
    ) {
    } else {
      setFormErrors({ ...formErrors, driveName: "Cannot edit name" });
    }
    setDrive({ ...drive, name: value });
    // todo: validate name is unique
    // axiosInstance
    //   .post(urls.getConfigForRemote, { name: value })
    //   .then((response) => {
    //     let dName = "";
    //     let isValid = isEmpty(response.data);
    //     if (isValid) {
    //       dName = "";
    //     } else {
    //       dName = "Duplicate";
    //     }
    //     setFormErrors({
    //       ...formErrors,
    //       driveName: dName,
    //     });
    //     setDrive({ ...drive, nameIsValid: isValid });
    //   });
  };

  /**
   * Open the advanced settings card and scroll into view.
   */
  const openAdvancedSettings = () => {
    if (advancedOptions) {
      setColAdvanced(true);
    } else {
      // this.configEndDiv.scrollIntoView({ behavior: "smooth" });
    }
  };

  /**
   * Clear the intervals.
   * */

  // const componentWillUnmount = () => {
  //   clearInterval(this.configCheckInterval);
  //   this.configCheckInterval = null;
  // };

  const gotoNextStep = () => {
    if (
      (advancedOptions && currentStepNumber === 3) ||
      (!advancedOptions && currentStepNumber === 2)
    ) {
      handleSubmit(null);
    } else {
      setCurrentStep(currentStepNumber + 1);
    }
  };

  const gotoPrevStep = () => {
    setCurrentStepNumber(currentStepNumber - 1);
  };

  const setCurrentStep = (stepNo) => {
    setCurrentStepNumber(stepNo);
  };

  const stepTitles = ["Set up Remote", "Set up Drive", "Advanced"];

  return (
    <div data-test="newDriveComponent">
      <ErrorBoundary>
        <nav className="mb-4">
          <ul className="flex border-b-2 border-gray-200 gap-3">
            {stepTitles.map((item, idx) => (
              <li key={idx} className="-mb-[2px]">
                <button
                  className={cn(
                    {
                      "font-bold border-b-2 border-black":
                        currentStepNumber === idx,
                    },
                    "p-2"
                  )}
                  onClick={() => setCurrentStep(idx)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={cn({
            hidden: currentStepNumber !== 0,
            block: currentStepNumber === 0,
          })}
        >
          <Card>
            <CardBody>
              <label htmlFor="driveName">Remote name</label>
              <input
                className="bg-gray-200 rounded-lg py-2 px-3 focus:outline-gray-400"
                type="text"
                value={drive.name}
                name="name"
                id="driveName"
                onChange={changeName}
                required={true}
              />
              {/* todo: fix validation  */}
              {drive.nameIsValid && <p>Sweet! that name is available</p>}
              {!drive.nameIsValid && <p>Name already used.</p>}

              <div>
                <label htmlFor="driveType">Select</label>
                <select onChange={changeDriveType}>
                  {providers.map((provider) => (
                    <option value={provider.Name}>{provider.Name}</option>
                  ))}
                </select>
              </div>
              <div className="clearfix">
                <div className="float-right">
                  <button className="ml-3 btn-blue" onClick={gotoNextStep}>
                    Next
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div
          className={cn({
            hidden: currentStepNumber !== 1,
            block: currentStepNumber === 1,
          })}
        >
          <Card>
            <CardBody>
              {drivePrefix && (
                <DriveParameters
                  drivePrefix={drivePrefix}
                  loadAdvanced={false}
                  changeHandler={handleInputChange}
                  errorsMap={formErrors}
                  isValidMap={isValid}
                  currentValues={formValues}
                  config={providers}
                />
              )}

              <div className="clearfix">
                <div className="float-right">
                  <input
                    type="checkbox"
                    checked={advancedOptions}
                    onChange={editAdvancedOptions}
                  />
                  <span className="mr-3">Edit Advanced Options</span>
                  <button className="btn-no-background" onClick={gotoPrevStep}>
                    Go back
                  </button>

                  <button className="ml-3 btn-blue" onClick={gotoNextStep}>
                    Next
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div
          className={cn({
            hidden: currentStepNumber !== 2,
            block: currentStepNumber === 2,
          })}
        >
          <Card>
            {/*
                    <CardHeader>
                      <h5>
                        <Button color="link" name="colAdvanced" onClick={this.toggle}
                          style={{marginBottom: '1rem'}}><strong>Step 3:</strong> Advanced
                          (optional)</Button>
                      </h5>
                    </CardHeader> */}

            <CardBody>
              {/* <DriveParameters
                drivePrefix={drivePrefix}
                loadAdvanced={true}
                changeHandler={this.handleInputChange}
                errorsMap={this.state.formErrors}
                isValidMap={this.state.isValid}
                currentValues={this.state.formValues}
                config={providers}
              /> */}

              <div className="clearfix">
                <div className="float-right">
                  <input
                    type="checkbox"
                    checked={advancedOptions}
                    onChange={editAdvancedOptions}
                  />
                  <span className="mr-3">Edit Advanced Options</span>
                  <button className="btn-no-background" onClick={gotoPrevStep}>
                    Go back
                  </button>

                  <button className="ml-3 btn-blue" onClick={gotoNextStep}>
                    Next
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="mt-10">
          <div className="mb-3">
            <button type="reset" onClick={() => clearForm()}>
              Clear
            </button>
            <button type="submit">Create Config</button>
          </div>
        </div>
        <NewDriveAuthModal
          isVisible={authModalIsVisible}
          closeModal={toggleAuthModal}
        />
      </ErrorBoundary>
    </div>
  );
}

// const mapStateToProps = (state) => ({
//   /**
//    * The list of all providers.
//    */
//   providers: state.config.providers,
// });

// NewDrive.propTypes = {
//   providers: PropTypes.array.isRequired,
//   getProviders: PropTypes.func.isRequired,
//   isEdit: PropTypes.bool.isRequired,
//   driveName: PropTypes.string,
// };

// NewDrive.defaultProps = {
//   isEdit: false,
// };

// export default connect(mapStateToProps, { getProviders })(NewDrive);
export default NewDrive;
