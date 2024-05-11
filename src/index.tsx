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
                type: "Drush",
                title: "Clear Cache",
                description: "Clear/Rebuild all caches.",
                cmd: "drush cache:rebuild;",
                docs_href:"https://www.drush.org/12.x/commands/cache_rebuild/",
                example: `\`\`\`\n> drush cache:rebuild\n> [success] Cache rebuild complete.\n\`\`\`\n\`\`\`\n> drush cr\n> [success] Cache rebuild complete.\n\`\`\``,
            },{
                type: "Other",
                title: "Clear Cache (using composer drush)",
                description: "Use drush executable file sitting inside the composer directory.",
                cmd: "vendor/bin/drush cache:rebuild;",
                docs_href:"https://www.drush.org/12.x/commands/cache_rebuild/",
                example: `\`\`\`\n> vendor/bin/drush cache:rebuild\n> [success] Cache rebuild complete.\n\`\`\`\n\`\`\`\n> vendor/bin/drush cr\n> [success] Cache rebuild complete.\n\`\`\``,
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
                type: "GovCMS",
                title: "GovCMS Drupal Login (Unblock root user)",
                description: "Using ahoy command to login into the drupal backend of the website with root user (uid=1)",
                cmd: "admin_username=$(ahoy drush uinf --uid=1 --fields=name --format=string) && ahoy drush uublk $admin_username && ahoy login",
                docs_href:"https://www.govcms.support/support/solutions/articles/51000005047-how-can-i-login-as-an-administrator-saas-on-my-local-development-environment-",
                example: "![](2024-05-11T115503.jpg)",
            },
        ]
    );


    // helper function to get the tag of command
    function CommandTagColor(_command_:Command):Color{
        if(_command_.type == "Drush")  {return(Color.Orange);}
        if(_command_.type == "GovCMS") {return(Color.Purple);}
        if(_command_.type == "Ahoy")   {return(Color.Purple);}
        if(_command_.type == "Error")  {return(Color.Red   );}
        if(_command_.type == "Twig")   {return(Color.Green );}
        return(Color.Blue);
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
                        icon={Icon.Circle}
                        key={_index_}
                        title={_command_.title}
                        subtitle={_command_.description}
                        accessories={[{tag:{value:_command_.type, color:CommandTagColor(_command_)}}]}
                        actions={
                            <ActionPanel title="Actions">
                                <Action
                                    title="Push"
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
                                <Action.CopyToClipboard
                                    title="Copy command to clipboard"
                                    content="https://github.com/raycast/extensions/pull/1"/>
                                <Action.OpenInBrowser
                                    title="Open official documentation"
                                    url="https://github.com/raycast/extensions/pull/1"/>
                            </ActionPanel>

                        }
                    />
                )
            )}
        </List>
    );
}
