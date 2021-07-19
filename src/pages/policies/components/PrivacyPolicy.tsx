import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import styles from "../styles/policy.style";

const PrivacyPolicy: React.FC = () => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <div className="content-container">
      <div className={classes.container}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Your privacy is important to us. It is Francesca Jade Creates&apos; policy to
          respect your privacy regarding any information we may collect from you across
          our website,{" "}
          <a href="https://www.francescajadecreates.co.uk">
            https://www.francescajadecreates.co.uk
          </a>
          , and other sites we own and operate.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          We only ask for personal information when we truly need it to provide a service
          to you. We collect it by fair and lawful means, with your knowledge and consent.
          We also let you know why we’re collecting it and how it will be used.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          We only retain collected information for as long as necessary to provide you
          with your requested service. What data we store, we’ll protect within
          commercially acceptable means to prevent loss and theft, as well as unauthorised
          access, disclosure, copying, use or modification.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          We don’t share any personally identifying information publicly or with
          third-parties, except when required to by law.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Our website may link to external sites that are not operated by us. Please be
          aware that we have no control over the content and practices of these sites, and
          cannot accept responsibility or liability for their respective privacy policies.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          You are free to refuse our request for your personal information, with the
          understanding that we may be unable to provide you with some of your desired
          services.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Your continued use of our website will be regarded as acceptance of our
          practices around privacy and personal information. If you have any questions
          about how we handle user data and personal information, feel free to contact us.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          This policy is effective as of 1 January 2021.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Cookie Policy
        </Typography>
        <Typography variant="body1" className={classes.text}>
          This is the Cookie Policy for Francesca Jade Creates, accessible from
          <a href="https://www.francescajadecreates.co.uk/">
            https://www.francescajadecreates.co.uk/
          </a>
        </Typography>
        <Typography className={classes.title}>What Are Cookies</Typography>
        <Typography variant="body1" className={classes.text}>
          As is common practice with almost all professional websites this site uses
          cookies, which are tiny files that are downloaded to your computer, to improve
          your experience. This page describes what information they gather, how we use it
          and why we sometimes need to store these cookies. We will also share how you can
          prevent these cookies from being stored however this may downgrade or
          &apos;break&apos; certain elements of the sites functionality.
        </Typography>
        <Typography className={classes.title}>How We Use Cookies</Typography>
        <Typography variant="body1" className={classes.text}>
          We use cookies for a variety of reasons detailed below. Unfortunately in most
          cases there are no industry standard options for disabling cookies without
          completely disabling the functionality and features they add to this site. It is
          recommended that you leave on all cookies if you are not sure whether you need
          them or not in case they are used to provide a service that you use.
        </Typography>
        <Typography className={classes.title}>Disabling Cookies</Typography>
        <Typography variant="body1" className={classes.text}>
          You can prevent the setting of cookies by adjusting the settings on your browser
          (see your browser Help for how to do this). Be aware that disabling cookies will
          affect the functionality of this and many other websites that you visit.
          Disabling cookies will usually result in also disabling certain functionality
          and features of the this site. Therefore it is recommended that you do not
          disable cookies.
        </Typography>
        <Typography className={classes.title}>The Cookies We Set</Typography>
        <ul>
          <li>
            <Typography variant="body1">Account related cookies</Typography>
            <Typography variant="body1" className={classes.text}>
              If you create an account with us then we will use cookies for the management
              of the signup process and general administration. These cookies will usually
              be deleted when you log out however in some cases they may remain afterwards
              to remember your site preferences when logged out.
            </Typography>
          </li>

          <li>
            <Typography variant="body1">Login related cookies</Typography>
            <Typography variant="body1" className={classes.text}>
              We use cookies when you are logged in so that we can remember this fact.
              This prevents you from having to log in every single time you visit a new
              page. These cookies are typically removed or cleared when you log out to
              ensure that you can only access restricted features and areas when logged
              in.
            </Typography>
          </li>

          <li>
            <Typography variant="body1">Orders processing related cookies</Typography>
            <Typography variant="body1" className={classes.text}>
              This site offers e-commerce or payment facilities and some cookies are
              essential to ensure that your order is remembered between pages so that we
              can process it properly.
            </Typography>
          </li>
        </ul>
        <Typography className={classes.title}>More Information</Typography>
        <Typography variant="body1" className={classes.text}>
          Hopefully that has clarified things for you and as was previously mentioned if
          there is something that you aren&apos;t sure whether you need or not it&apos;s
          usually safer to leave cookies enabled in case it does interact with one of the
          features you use on our site.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          For more general information on cookies, please read{" "}
          <a href="https://www.privacypolicyonline.com/what-are-cookies/">
            &quot;What Are Cookies&quot;
          </a>
          .
        </Typography>
        <Typography variant="body1" className={classes.text}>
          However if you are still looking for more information then you can contact us
          through one of our preferred contact methods:
        </Typography>
        <ul className={classes.text}>
          <li>
            Email:{" "}
            <a href="mailto:contact@francescajadecreates.co.uk">
              contact@francescajadecreates.co.uk
            </a>
          </li>
          <li>
            By visiting this link:{" "}
            <a href="https://www.francescajadecreates.co.uk/privacy-policy">
              https://www.francescajadecreates.co.uk/privacy-policy
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
