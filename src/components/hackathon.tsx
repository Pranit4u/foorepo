import { useEffect, useState } from "react";
import { Overview } from "./overview";
import { RecentSales } from "./recent-sales";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import axios from "axios";
import { Button } from "./ui/button";
import { IconSpinner } from "./icons";
``
export default function Hackathon() {
  interface ImpactRatings {
    [key: string]: number;
  }
  interface HackathonData {
    country: string;
    components: string[];
    news: string;
    impact_ratings: ImpactRatings;
    advice: {
      [key: string]: string;
    };
  };
  // const data = [
  //   {
  //     "country": "USA",
  //     "components": ["Glass", "Engines"],
  //     "news": "Worker union protests manage to increase minimum wage from 10$/hr to 15$/hr",
  //     "impact_ratings": {
  //       "Glass": -0.7,
  //       "Engines": -0.5
  //     } as ImpactRatings,
  //     "advice": {
  //       "Glass": "To mitigate the impact on Glass components, consider optimizing production processes and exploring alternative sourcing options.",
  //       "Engines": "To mitigate the impact on Engines production, focus on improving efficiency and automation in manufacturing processes."
  //     }
  //   },
  //   {
  //     "country": "USA",
  //     "components": ["Glass", "Engines"],
  //     "news": "Worker union protests manage to increase minimum wage from 10$/hr to 15$/hr",
  //     "impact_ratings": {
  //       "Glass": -0.7,
  //       "Engines": -0.5
  //     },
  //     "advice": {
  //       "Glass": "To mitigate the impact on Glass components, consider optimizing production processes and exploring alternative sourcing options.",
  //       "Engines": "To mitigate the impact on Engines production, focus on improving efficiency and automation in manufacturing processes."
  //     }
  //   }
  // ]
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HackathonData[]>([]);
  const [selectedData, setSelectedData] = useState<HackathonData>();

  useEffect(() => {
    setLoading(true);
    axios.get("API").then((response) => {
      setData(JSON.parse(response.data));
      setLoading(false);
    })
  });

  const loadAgain = async() => {
    setLoading(true);
    await axios.get("API").then((response) => {
      setData(JSON.parse(response.data));
      setLoading(false);
    })
  }

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="insights">
                Insights
              </TabsTrigger>
            </TabsList>
            <Button onClick={loadAgain} className="ml-10">{loading ? <IconSpinner /> : "Sync"}</Button>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="insights" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                { data &&
                  data.map((item) => {
                    return (
                      <Card onClick={() => {
                        setSelectedData(item)
                      }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {item.country}
                          </CardTitle>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                          >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$45,231.89</div>
                          <p className="text-xs text-muted-foreground mb-8">
                            +20.1% from last month
                          </p>
                          {
                            item.components.map((component) => {
                              return (
                                <div className="text-sm font-medium w-full flex justify-between">
                                  <div className="">
                                    {component}
                                  </div>
                                  <div>
                                    {item.impact_ratings[component]}
                                  </div>
                                </div>
                              )
                            })
                          }
                        </CardContent>
                      </Card>
                    )
                  })

                }
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>AI Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentSales advice={selectedData?.advice || {}} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
