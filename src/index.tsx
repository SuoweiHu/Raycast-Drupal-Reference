import { ActionPanel, Action, Icon, List, Color, Detail, useNavigation } from "@raycast/api";
import { useState } from "react";
import http from "http";


type Command = {
    type: string;
    title: string;
    cmd: string;
    description: string;
    example?: string;
    docs_href: string;
};


export default function Command() {

    // Get type of the useNavigation hook to perform push and pop actions.
    const { push, pop } = useNavigation();


    // Set of command that is commonly used:
    const [commands, setCommands] = useState<Command[]>(
        [
            {
                type: "GovCMS",
                title: "Unblock Root User + Login ",
                description: "Using ahoy command to login into the drupal backend of the website with root user (uid=1)",
                cmd: "admin_username=$(ahoy drush uinf --uid=1 --fields=name --format=string) && ahoy drush uublk $admin_username && ahoy login",
                docs_href:"https://github.com/govCMS/scaffold/blob/develop/.ahoy.yml",
                example: "![](2024-05-11T115503.jpg)",
            },{
                type: "GovCMS",
                title: "Build Project",
                description: "",
                cmd: "ahoy up",
                docs_href: "https://github.com/govCMS/scaffold/blob/develop/.ahoy.yml",
                example: `\`\`\`\nup:\nusage: Build project.\ncmd: |\n    docker compose up -d "$@" &&\n    docker compose exec -T test dockerize -wait tcp://mariadb:3306 -timeout 2m &&\n    ahoy info;\n\`\`\``,
            },{
                type: "GovCMS",
                title: "Build Project + Run Deployment",
                description: "Build Project + Runs deployment commands (e.g. config import, updb, cr, set up file_stage_proxy).",
                cmd: "ahoy up",
                docs_href: "https://github.com/govCMS/scaffold/blob/develop/.ahoy.yml",
                example: `\`\`\`\nbuild:\nusage: Build project.\ncmd: |\n    docker compose up -d --build "$@" &&\n    docker compose exec -T test dockerize -wait tcp://mariadb:3306 -timeout 2m &&\n    ahoy govcms-deploy && ahoy info;\n\`\`\``,
            },{
                type:"GovCMS",
                title:"Pause Project",
                description:"Pause the conatiner (do not remove database)",
                cmd:"ahoy stop",
                docs_href:"https://github.com/govCMS/scaffold/blob/develop/.ahoy.yml",
                example:`\`\`\`\nstop:\n    usage: Stop Docker containers.\n    cmd: docker compose stop "$@"\n\`\`\``,
            },{
                type: "GovCMS",
                title: "Delete Project",
                description: "Delete project (CAUTION).",
                cmd: "ahoy down",
                docs_href: "https://github.com/govCMS/scaffold/blob/develop/.ahoy.yml",
                example: `\`\`\`\ndown:\nusage: Delete project (CAUTION).\ncmd: |\n  if [ "$1" == "y" ]; then\n    docker compose down --volumes\n  else\n    ahoy confirm "Running this command will destroy your current site, database and build? Are you sure you didn't mean ahoy stop?" &&\n    # Run this if confirm returns true\n    docker compose down --volumes ||\n    # Run this if confirm returns false\n    echo "OK, probably a wise choice..."\n  fi\n\`\`\``,
            },{
                type: "GovCMS",
                title: "Export Database",
                description: "Use ahoy command to export mysql database to \".sql\" file.",
                cmd: "ahoy mysql-dump $EXPORT_FILE_NAME",
                docs_href: "https://github.com/govCMS/scaffold/blob/develop/.ahoy.yml",
                example: `\`\`\`\nmysql-import:\n    usage: Pipe in a sql file.  \`ahoy mysql-import local.sql\`\n    cmd: |\n      if [ -e "$@" ] ; then\n        docker compose exec cli bash -c 'drush sql-drop' &&\n        docker compose exec -T cli bash -c 'drush sql-cli' < "$@"\n      else echo "Provided sql file" "$@" "does not exist"\n      fi\n\`\`\``,
            },{
                type: "GovCMS",
                title: "Import Database",
                description: "Use ahoy command to import mysql database",
                cmd: "ahoy mysql-import $IMPORT_FILE_NAME",
                docs_href: "https://github.com/govCMS/scaffold/blob/develop/.ahoy.yml",
                example: `\`\`\`\nmysql-dump:\n   usage: Dump data out into a file. \`ahoy mysql-dump local.sql\`\n   cmd: docker compose exec -T cli bash -c 'drush sql-dump --ordered-dump' > "$@"\n\`\`\``,
            },{
                type: "Drush",
                title: "Clear Cache",
                description: "Clear/Rebuild all caches.",
                cmd: "drush cache:rebuild;",
                docs_href:"https://www.drush.org/12.x/commands/cache_rebuild/",
                example: `\`\`\`\n> drush cache:rebuild\n> [success] Cache rebuild complete.\n\`\`\`\n\`\`\`\n> drush cr\n> [success] Cache rebuild complete.\n\`\`\``,
            },{
                type: "Drush",
                title: "Debug verbose",
                description: "Set system debug level to verbose mode.",
                cmd: "drush config:set system.logging error_level verbose -y",
                docs_href:"https://www.drush.org/12.x/commands/config_set/",
                example:`\`\`\`\n> drush config:set system.logging error_level verbose -y\n> Do you want to update error_level key in system.logging config? \n> yes.\n\`\`\``,
            },{
                type: "Drush",
                title: "Enable twig debug",
                description: "Enable twig debug mode using drush command.",
                cmd: "drush twig:debug on && drush state:set disable_rendered_output_cache_bins 1 --input-format=integer  && drush cache:rebuild",
                docs_href:"https://www.drush.org/12.x/commands/twig_debug/",
                example:`\`\`\`\n> drush twig:debug on\n> [OK] Enabled twig debug.\n> drush state:set disable_rendered_output_cache_bins 1 --input-format=integer\n> drush cache:rebuild\n> [success] Cache rebuild complete.\n\`\`\``
            },{
                type: "Drush",
                title: "Disable twig debug",
                description: "Disable twig debug mode using drush command.",
                cmd: "drush twig:debug off && drush state:set disable_rendered_output_cache_bins 0 --input-format=integer && drush cache:rebuild",
                docs_href:"https://www.drush.org/12.x/commands/twig_debug/",
                example:`\`\`\`\n> drush twig:debug on\n> [OK] Disabled twig debug.\n> drush state:set disable_rendered_output_cache_bins 1 --input-format=integer\n> drush cache:rebuild\n> [success] Cache rebuild complete.\n\`\`\``
            },{
                type: "Drush",
                title: "List theme",
                description: "List all the themes existing on the drupal website.",
                cmd: "drush pm-list --type=Theme",
                docs_href:"https://www.drush.org/12.x/commands/pm_list/",
                example:`![](2024-05-11T114445.jpg)`,
            },{
                type: "Drush",
                title: "List installed modules",
                description: "List enabled modules installed on the drupal website.",
                cmd: "drush pm-list --type=Module --status=enabled",
                docs_href:"https://www.drush.org/12.x/commands/pm_list/",
                example:`![](2024-05-11T114956.jpg)`,
            },{
                type: "Drush",
                title: "Export installed modules to csv",
                description: "Save enabled modules installed on the drupal website into a CSV file",
                cmd: "drush pm-list --type=Module --status=enabled -vvv --format=csv >> enabled_modules.csv",
                docs_href:"https://www.drush.org/12.x/commands/pm_list/",
                example: `\`\`\`\npm-list:           list modules/themes\n--type=Module:     list modules only\n--status=enabled:  list enabled modules/theme only \n--format:          format the result data. \n-v|vv|vvv|verbose: increase the verbosity of messages \n\`\`\`\n![](2024-05-11T115202.jpg)`
            },{
                type: "Other",
                title: "Clear Cache (using composer drush)",
                description: "Use drush executable file sitting inside the composer directory.",
                cmd: "vendor/bin/drush cache:rebuild;",
                docs_href:"https://www.drush.org/12.x/commands/cache_rebuild/",
                example: `\`\`\`\n> vendor/bin/drush cache:rebuild\n> [success] Cache rebuild complete.\n\`\`\`\n\`\`\`\n> vendor/bin/drush cr\n> [success] Cache rebuild complete.\n\`\`\``,
            },{
                type: "GovCMS",
                title: "Validate SaaS Compatibility (ship-shape)",
                description: "Use ahoy command to test SaaS compatibility of the modules/files used in the project.",
                cmd: "ahoy ship-shape",
                docs_href: "https://github.com/govCMS/scaffold/blob/develop/.ahoy.yml",
                example: `\`\`\`\nahoy ship-shape\nShip is in top shape; no breach detected!\n\`\`\``,
            },
        ]
    );


    // helper function to get the tag of command
    function CommandTagColor(_command_:Command):Color{
        if(_command_.type == "Drush")  {return(Color.Orange      );}
        if(_command_.type == "GovCMS") {return(Color.Purple      );}
        if(_command_.type == "Ahoy")   {return(Color.Purple      );}
        if(_command_.type == "Error")  {return(Color.Red         );}
        if(_command_.type == "Twig")   {return(Color.Green       );}
        if(true)                       {return(Color.Blue        );}
    }

    // helper function to get the tag of command
    function CommandTagIcon(_command_:Command):Icon{
        if(_command_.type == "Drush")  {return(Icon.CommandSymbol);}
        if(_command_.type == "GovCMS") {return(Icon.Hashtag      );}
        if(_command_.type == "Ahoy")   {return(Icon.Hashtag      );}
        if(_command_.type == "Error")  {return(Icon.Bug          );}
        if(_command_.type == "Twig")   {return(Icon.CodeBlock    );}
        if(true)                       {return(Icon.Circle       );}
    }


    // component for details display of command
    function CommandDetail(_command_:Command){
        return (<Detail
                    markdown={_command_.example}
                    navigationTitle={_command_.title}
                    metadata={
                        <Detail.Metadata>
                            <Detail.Metadata.Label
                                title="Title"
                                text={_command_.title} />
                            <Detail.Metadata.TagList
                                title="Type">
                                <Detail.Metadata.TagList.Item
                                    text={_command_.type}
                                    color={CommandTagColor(_command_)} />
                            </Detail.Metadata.TagList>
                            <Detail.Metadata.Label title="Description" text={_command_.description} />
                            <Detail.Metadata.Separator />
                            <Detail.Metadata.Link title="Official Documentation" target={_command_.docs_href} text={_command_.docs_href} />
                        </Detail.Metadata>
                    }
                    actions={
                        <ActionPanel title="Actions">
                            <Action.CopyToClipboard
                                icon={Icon.CopyClipboard}
                                title="Copy Command"
                                content={_command_.cmd}/>
                            <Action.OpenInBrowser
                                icon={Icon.Compass}
                                title="Open Documentation"
                                url={_command_.docs_href}/>
                        </ActionPanel>
                    }
        />);
    }



    // Show the list of commands available
    return (
        <List
            filtering={true}
            navigationTitle="Drupal Cheatsheet"
            searchBarPlaceholder="Search drupal related command here."
        >
            {commands.map(
                (_command_, _index_) => (
                    <List.Item
                        icon={CommandTagIcon(_command_)}
                        key={_index_}
                        title={_command_.title}
                        subtitle={_command_.description}
                        accessories={[{tag:{value:_command_.type, color:CommandTagColor(_command_)}}]}
                        actions={
                            <ActionPanel title="Actions">
                                <Action
                                    icon={Icon.Center}
                                    title="Show Details"
                                    onAction={
                                        () => push(
                                            <CommandDetail
                                                type={_command_.type}
                                                title={_command_.title}
                                                cmd={_command_.cmd}
                                                description={_command_.description}
                                                example={_command_.example}
                                                docs_href={_command_.docs_href}
                                            />
                                        )
                                    } />
                                <Action.OpenInBrowser
                                    icon={Icon.Compass}
                                    title="Open Documentation"
                                    url={_command_.docs_href}/>
                            </ActionPanel>

                        }
                    />
                )
            )}
        </List>
    );
}
