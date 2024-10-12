import { Box, Container, Text } from "@mantine/core";
import { createClient } from "../../utils/supabase/server";
import DisplayText from "./components/display";
import { StatsGrid2 } from "./components/stats-grid-2";

export default async function ReadPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const supabase = createClient();

  const { data } = await supabase
    .from("submissions")
    .select()
    .eq("id", id)
    .single();

  //TODO: Determine the difference between no permission and no data when the error message is the same
  if (!data) {
    return (
      <Text c="red">You do not have permission to view this submission.</Text>
    );
  }

  const text = `
  Lorem ipsum odor amet, consectetuer adipiscing elit. Ipsum sem laoreet ex faucibus sed ornare. Sem fames volutpat nostra condimentum; gravida natoque! Tempus facilisis curae vulputate fermentum ac faucibus efficitur morbi. Torquent curae faucibus ullamcorper per phasellus id ultricies. Semper laoreet class curae et rutrum. Magna libero eget rutrum vulputate sed. Praesent nulla vivamus porttitor, himenaeos egestas bibendum. Rhoncus commodo aptent nulla; fringilla primis platea semper sollicitudin iaculis.

Tellus netus nascetur vehicula rutrum turpis congue fermentum; tortor nullam. Nisl etiam sem class sodales facilisis hendrerit mollis neque. Hendrerit mauris nam eu lobortis, potenti duis risus et. Vitae proin bibendum bibendum nunc tortor aliquet torquent. Libero sapien condimentum fames sociosqu in nisl fringilla at. Id taciti neque ornare adipiscing; purus eleifend. Efficitur odio erat senectus posuere mus cursus molestie lobortis. Primis cursus ornare velit eros erat torquent per magna class.

Torquent maximus euismod arcu natoque suspendisse. Taciti sollicitudin lectus tortor urna placerat natoque etiam. Suspendisse accumsan finibus egestas purus; facilisi elit nisi. Habitasse ultricies dui varius aptent aliquam semper. Facilisis primis mollis curae porta; etiam quis. Leo potenti vulputate eget habitasse luctus convallis auctor venenatis. Est aenean cursus curae bibendum magnis aenean ornare. Nam inceptos quis ligula duis justo consectetur facilisis etiam nisl? Laoreet sociosqu efficitur consequat ligula velit diam tortor efficitur. Risus parturient vulputate augue finibus vitae mollis phasellus.

Nisi montes aliquet lacinia integer orci; sociosqu quis. Lobortis ullamcorper ac venenatis tellus nec senectus ornare. Elementum senectus diam feugiat turpis; ornare duis. Commodo feugiat lacus massa ligula pellentesque sociosqu. Quis vel rhoncus, maecenas mi ad curae porta. Mattis hendrerit sem nibh elementum duis sollicitudin sollicitudin. Est praesent aliquet dapibus libero; sit dolor.

Erat mauris hendrerit est aenean dolor auctor. Turpis netus parturient faucibus pellentesque felis conubia curae dignissim. Pellentesque lacus erat ridiculus at cursus pulvinar habitasse volutpat. Facilisis penatibus aliquam natoque volutpat nascetur elementum venenatis. Facilisis eget sagittis inceptos risus curae suspendisse. Nulla imperdiet laoreet luctus egestas duis pharetra elit urna. Lectus suscipit mi arcu mattis euismod torquent gravida cubilia. Elit iaculis aliquet netus diam egestas eu dictumst ultricies. Nec aliquet elit quis porttitor lobortis.

Accumsan magnis egestas aenean ultrices habitasse quisque ac litora. Viverra velit purus eget commodo at placerat. Maecenas iaculis sed aliquam ac semper habitasse iaculis. Dignissim mauris non pretium est pulvinar dolor. Netus quam nullam pharetra odio natoque at inceptos laoreet platea. Lectus vivamus iaculis eget malesuada montes rhoncus a taciti ullamcorper? Vivamus elit id natoque vehicula finibus platea nisi. Per et amet eget netus pretium convallis. Dictum pellentesque netus commodo eu elit facilisi at eleifend bibendum.

Risus laoreet efficitur nisi ultricies inceptos dapibus sed nisl per. Pretium consequat ad fringilla accumsan platea posuere. Justo efficitur ex maximus nisi dictum pharetra vehicula viverra. Cras orci dictumst habitasse ante iaculis lorem placerat risus. Morbi urna dolor blandit sed ultricies. Magna rutrum tempus laoreet curae urna ultrices dui. Porta viverra egestas bibendum ac conubia ornare malesuada. Posuere velit aliquet facilisi mi habitasse porta vel, suscipit nam.

Urna dolor euismod aliquet donec amet semper ut dictumst. Velit morbi suscipit fermentum dignissim sapien tincidunt sapien. Fames montes quam elit torquent ultricies. Ridiculus neque class enim aliquet magna nullam. Magnis maecenas ullamcorper iaculis nulla nullam? Aliquam netus nulla curae suscipit massa molestie leo. Condimentum habitasse nostra ligula quisque nostra. Odio sagittis magna nulla potenti viverra eleifend.

Dis fermentum a semper porttitor nec facilisis. Placerat sit a molestie sagittis sagittis primis ipsum tellus pulvinar. Aenean pellentesque amet metus in efficitur a phasellus. Mauris sagittis velit dis elit molestie fusce elementum. Pellentesque tellus imperdiet himenaeos nisi porta etiam dis hendrerit. Tortor rhoncus ridiculus nam dictum praesent pulvinar suspendisse porttitor mi. Efficitur cubilia ipsum condimentum in arcu fermentum.

Lacinia quisque montes taciti nisl risus nullam viverra. Non luctus nascetur sagittis felis velit dis etiam aliquet. Fames efficitur risus nibh taciti sapien porttitor fames platea. Eget ante risus elit ultricies hendrerit quisque hac. Fermentum auctor scelerisque laoreet lectus massa tempor himenaeos conubia libero. Quam nam molestie fames posuere sapien laoreet odio amet sollicitudin. Dapibus congue egestas accumsan in justo. Aenean augue consectetur sapien habitasse potenti quisque erat adipiscing. Sapien inceptos mus duis eu ut suscipit est quisque nam.
  `;

  return (
    <Container
      style={{ height: "85vh", display: "flex", flexDirection: "column" }}
    >
      {/* Scrollable Display Area */}
      <Box style={{ flex: 1, overflow: "hidden" }}>
        <DisplayText
          data={{
            text: text,
            character_data: data.character_data,
            prompt: data.prompt,
            metadata_stats: data.metadata_stats,
          }}
        />
      </Box>

      {/* Stats grids at the bottom */}
      <Box mt="md" style={{ flexShrink: 0 }}>
        <StatsGrid2 stats={data.metadata_stats} />
      </Box>
    </Container>
  );
}
