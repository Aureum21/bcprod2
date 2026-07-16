import { Chart, useChart } from "@chakra-ui/charts";
import { Cell, LabelList, Pie, PieChart, Tooltip } from "recharts";
interface Props {
  data: { name: string; value: number; color: string }[];
}
const Piechart = ({ data }: Props) => {
  const chart = useChart({
    data,
  });

  return (
    <Chart.Root
      boxSize="200px"
      alignItems="center"
      alignSelf="center"
      chart={chart}
    >
      <PieChart>
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip hideLabel />}
        />
        <Pie
          isAnimationActive={true}
          data={chart.data}
          dataKey={chart.key("value")}
        >
          <LabelList position="inside" fill="white" stroke="none" />
          {chart.data.map((item) => (
            <Cell key={item.name} fill={chart.color(item.color)} />
          ))}
        </Pie>
      </PieChart>
    </Chart.Root>
  );
};

export default Piechart;
