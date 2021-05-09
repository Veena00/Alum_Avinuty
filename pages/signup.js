import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Message,
  Segment,
  Divider,
  Radio,
  Select,
} from "semantic-ui-react";
import CommonInputs from "../components/Common/CommonInputs";
import ImageDropDiv from "../components/Common/ImageDropDiv";
import {
  HeaderMessage,
  FooterMessage,
} from "../components/Common/WelcomeMessage";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { registerUser } from "../utils/authUser";
import uploadPic from "../utils/uploadPicToCloudinary";
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
let cancel;

const departments = [
  {
    key: "1",
    text: "Computer science and Engineering",
    value: "Computer science and Engineering",
  },
  {
    key: "2",
    text: "Electronics and Communications Engineering",
    value: "Electronics and Communications Engineering",
  },
  { key: "3", text: "Information technology", value: "Information technology" },
  { key: "4", text: "Civil Engineering", value: "Civil Engineering" },
  {
    key: "5",
    text: "Biomedical and Instrumentation Engineering",
    value: "Biomedical and Instrumentation Engineering",
  },
  {
    key: "6",
    text: "Food Processing and Preservation technology",
    value: "Food Processing and Preservation technology",
  },
  { key: "7", text: "Printing technology", value: "Printing technology" },
  {
    key: "8",
    text: "Electrical and Electronic Engineering",
    value: "Electrical and Electronic Engineering",
  },
];
function Signup() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passout_year: "",
    department: "",
    role: "",
    registration_number: "",
    bio: "",
  });

  const { name, email, password, passout_year, role, department, bio } = user;

  const alumni = "alumni";
  const present_student = "present_student";

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const [showRegNo, setShowRegNo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }

    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setErrorMsg("Error Uploading Image");
    }

    await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading);
  };

  useEffect(() => {
    const isUser = Object.values({
      name,
      email,
      password,
      passout_year,
      department,
      role,
    }).every((item) => Boolean(item));
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();

      const CancelToken = axios.CancelToken;

      const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      errorMsg !== null && setErrorMsg(null);

      if (res.data === "Available") {
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      }
    } catch (error) {
      setErrorMsg("Username Not Available");
      setUsernameAvailable(false);
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    username === "" ? setUsernameAvailable(false) : checkUsername();
  }, [username]);

  return (
    <>
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="OOPS!!"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />

        <Segment>
          <ImageDropDiv
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handleChange}
          />

          <Form.Input
            label="Name"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
            required
          />

          <Form.Input
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
            required
          />

          <Form.Input
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword),
            }}
            iconPosition="left"
            type={showPassword ? "text" : "password"}
            required
          />

          <Form.Input
            loading={usernameLoading}
            error={!usernameAvailable}
            label="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (regexUserName.test(e.target.value)) {
                setUsernameAvailable(true);
              } else {
                setUsernameAvailable(false);
              }
            }}
            fluid
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
            required
          />

          <Form.Input
            label="Passout Year YYYY"
            placeholder="Year of Passing Out"
            name="passout_year"
            value={passout_year}
            onChange={handleChange}
            fluid
            icon="calendar"
            iconPosition="left"
            required
          />

          <Form.Field
            control={Select}
            label="Department Of Study"
            options={departments}
            onChange={(e, data) =>
              setUser((prev) => ({ ...prev, department: data.value }))
            }
            placeholder="Department Of Study"
            required
          />

          <Form.Group inline>
            <label>Your Role:</label>
            <Form.Field
              control={Radio}
              label={alumni}
              value={alumni}
              checked={user.role === alumni}
              onChange={(e, data) =>
                setUser((prev) => ({ ...prev, role: data.value }))
              }
            />
            <Form.Field
              control={Radio}
              label={present_student}
              value={present_student}
              checked={user.role === present_student}
              onChange={(e, data) =>
                setUser((prev) => ({ ...prev, role: data.value }))
              }
            />
          </Form.Group>

          <CommonInputs
            user={user}
            showRegNo={showRegNo}
            setShowRegNo={setShowRegNo}
            handleChange={handleChange}
          />

          <Divider hidden />
          <Button
            icon="signup"
            content="Signup"
            type="submit"
            color="orange"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>

      <FooterMessage />
    </>
  );
}

export default Signup;
