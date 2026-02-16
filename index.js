import { Command } from "commander";
import genDiff from "./src/gendiff";

const DefaultOutFormat = 'stylish';
const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2, options) => {
    try {
      const outFormat = options.format || DefaultOutFormat;
      const result = genDiff(filepath1, filepath2, outFormat);
      console.log(result);
    } catch (error) {
      program.error(`Error: ${error.message}`);
    }
  });

program.parse(process.argv);
