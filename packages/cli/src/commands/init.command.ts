import { ModuleDefinition } from '@peque/framework';
import { Option } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as shelljs from 'shelljs';

import { CommandInterface, ExecuteOptions } from '../models/command.interface';
import { RenderFile } from '../models/render';
import { GeneralMetadata } from '../schemas/schemes';
import { GenerateCommand } from './generate.command';

export class InitCommand extends RenderFile implements CommandInterface {
  private projectName = '';
  private projectPath = '';

  command(): Option {
    return new Option('-i, --init <project name>', 'Generates an npm Peque.ts project boilerplate');
  }

  execute(options: ExecuteOptions): void {
    this.projectName = options.command;
    this.projectPath = `${process.cwd()}/${this.projectName}`;
    fs.mkdirSync(this.projectPath);

    shelljs.config.silent = true;
    shelljs.cd(this.projectName);
    shelljs.mkdir('src', 'src/modules', 'src/modules/root', 'src/modules/root/controllers', 'test');

    this.packageJson();
    this.tsconfig();
    this.gitNpmIgnore();
    this.eslint();
    this.prettier();
    this.main();
    this.rootModuleAndController();
    this.installDependencies();
  }

  private packageJson() {
    shelljs.exec('npm init -y');

    console.log('Creating package.json...');
    const packageJsonPath = `${this.projectPath}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(`${this.projectPath}/package.json`, { encoding: 'utf8' }));
    packageJson.name = this.projectName;
    packageJson.scripts.start = 'ts-node src/main.ts';
    packageJson.scripts.build = 'rimraf dist && tsc';
    packageJson.scripts.lint = 'eslint "{src,test}/**/*.ts" --fix';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), { encoding: 'utf8' });
  }

  private tsconfig() {
    console.log('Creating tsconfig.json...');
    this.render(path.join(__dirname, '../schemas/mustache/init/tsconfig.mustache'), {}, 'tsconfig.json');
  }

  private gitNpmIgnore() {
    console.log('Creating ignore files...');
    this.render(path.join(__dirname, '../schemas/mustache/init/gitignore.mustache'), {}, '.gitignore');
    this.render(path.join(__dirname, '../schemas/mustache/init/npmignore.mustache'), {}, '.npmignore');
  }

  private eslint() {
    console.log('ES Lint...');
    this.render(path.join(__dirname, '../schemas/mustache/init/eslint.mustache'), {}, '.eslintrc.js');
  }

  private prettier() {
    console.log('Prettier...');
    this.render(path.join(__dirname, '../schemas/mustache/init/prettierignore.mustache'), {}, '.prettierignore');
    this.render(path.join(__dirname, '../schemas/mustache/init/prettierrc.mustache'), {}, '.prettierrc.json');
  }

  private installDependencies() {
    console.log('Installing dependencies...');
    shelljs.exec('npm i peque.ts --save');
    shelljs.exec('npm i ts-node @types/node typescript rimraf --save-dev');
    shelljs.exec(
      'npm i ts-node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-simple-import-sort prettier --save-dev',
    );
  }

  private main() {
    this.render(path.join(__dirname, '../schemas/mustache/init/main.mustache'), {}, 'src/main.ts');
  }

  private rootModuleAndController() {
    class RootController {}

    const metadata: GeneralMetadata<ModuleDefinition> = {
      data: {
        modules: [],
        controllers: [RootController],
        interceptors: [],
        providers: [],
        webSockets: [],
      },
      imports: [`import { RootController } from './controllers/root-controller'`],
    };
    const generateCommand = new GenerateCommand();
    generateCommand.execute({ command: 'module', args: ['src/modules/root/root-module.ts'], metadata });
    generateCommand.execute({ command: 'controller', args: ['src/modules/root/controllers/root-controller.ts'] });
  }
}
