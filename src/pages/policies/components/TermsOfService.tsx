import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import styles from "../styles/policy.style";

const TermsOfService: React.FC = () => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h4">Terms of Service</Typography>
      <Typography variant="h6" style={{ textAlign: "left" }}>
        1. Terms
      </Typography>
      <Typography className={classes.text}>
        By accessing this website you are agreeing to be bound by these terms of service,
        all applicable laws and regulations, and agree that you are responsible for
        compliance with any applicable local laws. If you do not agree with any of these
        terms, you are prohibited from using or accessing this site. The materials
        contained in this website are protected by applicable copyright and trademark law.
      </Typography>
      <Typography variant="h6" style={{ textAlign: "left" }}>
        2. Use Licence
      </Typography>
      <ol type="a" className={classes.text} style={{ margin: "0 0 10px" }}>
        <li>
          Permission is granted to temporarily download one copy of the materials
          (information or software) on Francesca Jade Creates&apos; website for personal,
          non-commercial transitory viewing only. This is the grant of a licence, not a
          transfer of title, and under this licence you may not:
          <ol type="i">
            <li>modify or copy the materials;</li>
            <li>
              use the materials for any commercial purpose, or for any public display
              (commercial or non-commercial);
            </li>
            <li>
              attempt to decompile or reverse engineer any software contained on Francesca
              Jade Creates&apos; website;
            </li>
            <li>
              remove any copyright or other proprietary notations from the materials; or
            </li>
            <li>
              transfer the materials to another person or &quot;mirror&quot; the materials
              on any other server.
            </li>
          </ol>
        </li>
        <li>
          This licence shall automatically terminate if you violate any of these
          restrictions and may be terminated by Francesca Jade Creates at any time. Upon
          terminating your viewing of these materials or upon the termination of this
          licence, you must destroy any downloaded materials in your possession whether in
          electronic or printed format.
        </li>
      </ol>
      <Typography variant="h6" style={{ textAlign: "left" }}>
        3. Disclaimer
      </Typography>
      <ol type="a" className={classes.text} style={{ margin: "0 0 10px" }}>
        <li>
          The materials on Francesca Jade Creates&apos; website are provided on an
          &apos;as is&apos; basis. Francesca Jade Creates makes no warranties, expressed
          or implied, and hereby disclaims and negates all other warranties including,
          without limitation, implied warranties or conditions of merchantability, fitness
          for a particular purpose, or non-infringement of intellectual property or other
          violation of rights.
        </li>
        <li>
          Further, Francesca Jade Creates does not warrant or make any representations
          concerning the accuracy, likely results, or reliability of the use of the
          materials on its website or otherwise relating to such materials or on any sites
          linked to this site.
        </li>
      </ol>
      <Typography variant="h6" style={{ textAlign: "left" }}>
        4. Limitations
      </Typography>
      <Typography className={classes.text}>
        In no event shall Francesca Jade Creates or its suppliers be liable for any
        damages (including, without limitation, damages for loss of data or profit, or due
        to business interruption) arising out of the use or inability to use the materials
        on Francesca Jade Creates&apos; website, even if Francesca Jade Creates or a
        Francesca Jade Creates authorised representative has been notified orally or in
        writing of the possibility of such damage. Because some jurisdictions do not allow
        limitations on implied warranties, or limitations of liability for consequential
        or incidental damages, these limitations may not apply to you.
      </Typography>
      <Typography variant="h6" style={{ textAlign: "left" }}>
        5. Accuracy of materials
      </Typography>
      <Typography className={classes.text}>
        The materials appearing on Francesca Jade Creates&apos; website could include
        technical, typographical, or photographic errors. Francesca Jade Creates does not
        warrant that any of the materials on its website are accurate, complete or
        current. Francesca Jade Creates may make changes to the materials contained on its
        website at any time without notice. However Francesca Jade Creates does not make
        any commitment to update the materials.
      </Typography>
      <Typography variant="h6" style={{ textAlign: "left" }}>
        6. Links
      </Typography>
      <Typography className={classes.text}>
        Francesca Jade Creates has not reviewed all of the sites linked to its website and
        is not responsible for the contents of any such linked site. The inclusion of any
        link does not imply endorsement by Francesca Jade Creates of the site. Use of any
        such linked website is at the user&apos;s own risk.
      </Typography>
      <Typography variant="h6" style={{ textAlign: "left" }}>
        7. Modifications
      </Typography>
      <Typography className={classes.text}>
        Francesca Jade Creates may revise these terms of service for its website at any
        time without notice. By using this website you are agreeing to be bound by the
        then current version of these terms of service.
      </Typography>
      <Typography variant="h6" style={{ textAlign: "left" }}>
        8. Governing Law
      </Typography>
      <Typography className={classes.text}>
        These terms and conditions are governed by and construed in accordance with the
        laws of the United Kingdom and you irrevocably submit to the exclusive
        jurisdiction of the courts in that State or location.
      </Typography>
    </div>
  );
};

export default TermsOfService;
