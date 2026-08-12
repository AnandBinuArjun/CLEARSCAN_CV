import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#000000',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontSize: 10,
    color: '#333333',
  },
  contactItem: {
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 6,
  },
  paragraph: {
    textAlign: 'justify',
  },
  skillsRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  italic: {
    fontFamily: 'Helvetica-Oblique',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entrySubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 10,
  },
  bullet: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
});

const getFontFamily = (template) => {
  switch (template) {
    case 'classic': return 'Times-Roman';
    case 'modern': return 'Helvetica';
    case 'compact': return 'Courier';
    default: return 'Times-Roman';
  }
};

const getBoldFont = (template) => {
  switch (template) {
    case 'classic': return 'Times-Bold';
    case 'modern': return 'Helvetica-Bold';
    case 'compact': return 'Courier-Bold';
    default: return 'Times-Bold';
  }
};

const getItalicFont = (template) => {
  switch (template) {
    case 'classic': return 'Times-Italic';
    case 'modern': return 'Helvetica-Oblique';
    case 'compact': return 'Courier-Oblique';
    default: return 'Times-Italic';
  }
};

export const CVPreviewPDF = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, activeTemplate } = data;

  const stripHttp = (url) => url ? url.replace(/^https?:\/\/(www\.)?/, '') : '';
  
  const baseFont = getFontFamily(activeTemplate);
  const boldFont = getBoldFont(activeTemplate);
  const italicFont = getItalicFont(activeTemplate);

  const dynamicStyles = StyleSheet.create({
    page: { padding: 40, fontFamily: baseFont, fontSize: 11, lineHeight: 1.4, color: '#000000' },
    name: { fontSize: 20, fontFamily: boldFont, textTransform: 'uppercase', marginBottom: 4 },
    sectionTitle: { fontSize: 13, fontFamily: boldFont, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 2, marginBottom: 6 },
    bold: { fontFamily: boldFont },
    italic: { fontFamily: italicFont }
  });

  return (
    <Document>
      <Page size="A4" style={[styles.page, dynamicStyles.page]}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.name, dynamicStyles.name]}>{personalInfo.fullName || 'Your Name'}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>• {personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactItem}>• {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text style={styles.contactItem}>• {stripHttp(personalInfo.linkedin)}</Text>}
            {personalInfo.portfolio && <Text style={styles.contactItem}>• {stripHttp(personalInfo.portfolio)}</Text>}
          </View>
        </View>

        {/* SUMMARY */}
        {summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Professional Summary</Text>
            <Text style={styles.paragraph}>{summary}</Text>
          </View>
        )}

        {/* SKILLS */}
        {(skills.hard.length > 0 || skills.soft.length > 0) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Skills</Text>
            {skills.hard.length > 0 && (
              <View style={styles.skillsRow}>
                <Text style={[styles.bold, dynamicStyles.bold]}>Technical: </Text>
                <Text>{skills.hard.join(', ')}</Text>
              </View>
            )}
            {skills.soft.length > 0 && (
              <View style={styles.skillsRow}>
                <Text style={[styles.bold, dynamicStyles.bold]}>Professional: </Text>
                <Text>{skills.soft.join(', ')}</Text>
              </View>
            )}
          </View>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Experience</Text>
            {experience.map((exp, idx) => (
              <View key={idx} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={[styles.bold, dynamicStyles.bold]}>{exp.title}</Text>
                  <Text>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
                </View>
                <View style={styles.entrySubheader}>
                  <Text style={[styles.italic, dynamicStyles.italic]}>{exp.company}</Text>
                  <Text>{exp.location}</Text>
                </View>
                {exp.bullets && exp.bullets.map((bullet, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <View style={styles.entryHeader}>
                  <Text style={[styles.bold, dynamicStyles.bold]}>{edu.degree}</Text>
                  <Text>{edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate}</Text>
                </View>
                <View style={styles.entrySubheader}>
                  <Text style={[styles.italic, dynamicStyles.italic]}>{edu.institution}</Text>
                  <Text>{edu.location}</Text>
                </View>
                {edu.gpa && <Text>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Projects</Text>
            {projects.map((proj, idx) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <View style={styles.entryHeader}>
                  <Text style={[styles.bold, dynamicStyles.bold]}>
                    {proj.name} {proj.link ? `| ${stripHttp(proj.link)}` : ''}
                  </Text>
                </View>
                {proj.techStack && <Text style={[styles.italic, dynamicStyles.italic, { marginBottom: 2 }]}>Stack: {proj.techStack}</Text>}
                <Text style={styles.paragraph}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Certifications</Text>
            {certifications.map((cert, idx) => (
              <View key={idx} style={styles.entryHeader}>
                <Text><Text style={[styles.bold, dynamicStyles.bold]}>{cert.name}</Text> — {cert.issuer}</Text>
                <Text>{cert.date}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
