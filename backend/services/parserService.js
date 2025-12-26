const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class ParserService {
  async parseFile(filePath, fileType) {
    try {
      if (fileType === 'pdf') {
        return await this.parsePDF(filePath);
      } else if (fileType === 'docx') {
        return await this.parseDOCX(filePath);
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      throw new Error('Failed to parse file: ' + error.message);
    }
  }

  async parsePDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      throw new Error('Failed to parse PDF: ' + error.message);
    }
  }

  async parseDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new Error('Failed to parse DOCX: ' + error.message);
    }
  }
}

module.exports = new ParserService();
