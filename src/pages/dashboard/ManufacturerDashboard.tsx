import { Label } from '@/components/ui/label';
import React from 'react';
import { Icon, IconNode, LucideIcon, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const ManufacturerDashboard = () => {
  const Sections: {
    Icon: LucideIcon;
    title: string;
    count: number;
    description: string;
  }[] = [
    {
      Icon: TrendingUp,
      title: 'Categories',
      count: 12,
      description: 'Total categories available in your store',
    },
    {
      Icon: TrendingUp,
      title: 'Sub Categories',
      count: 12,
      description: 'Total sub categories available in your store',
    },
    {
      Icon: TrendingUp,
      title: 'Products',
      count: 12,
      description: 'Total products available in your store',
    },
  ];

  return (
    <React.Fragment>
      <div className="flex justify-between items-center ">
        <Label className="text-xl font-semibold mb-4 sm:mb-0">
          Dashboard 👋
        </Label>
      </div>
      <div className="grid grid-cols-1  md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5">
        {Sections.map((section, sectionIndex) => {
          return (
            <Card
              className="flex flex-col group shadow-none hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:cursor-pointer"
              key={sectionIndex}
            >
              <CardHeader>
                <CardTitle className="text-lg ">
                  <section.Icon className="mr-2 mb-2 h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 ">
                <p className="text-xl font-bold">{section.count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Donut with Text</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card> */}
    </React.Fragment>
  );
};

export default ManufacturerDashboard;
