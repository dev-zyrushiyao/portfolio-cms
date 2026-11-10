"use client";

import React, { useEffect, useRef, useState } from "react";

import Navbar from "../components/ui/Navbar";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import getCategories, { CategoryProp } from "../services/category";
import getContacts, {
  ContactProp,
  updateContactRead,
} from "../services/contact";
import ActionMenu from "../components/ui/ActionMenu";
import { convertDate } from "../services/utils";

export default function Dashboard() {
  const [categoriesData, setCategoriesData] = useState<CategoryProp[]>([]);
  const [contactData, setContactData] = useState<ContactProp[]>([]);

  //currentState
  const [selectedCategory, setSelectedCategory] = useState<
    number | "all" | null
  >("all");
  const filteredContacts = contactData.filter(
    (cont) => cont.category_id === selectedCategory,
  );
  const [selectedContact, setSelectedContact] = useState<ContactProp | null>(
    null,
  );

  useEffect(() => {
    async function fetchCategories(): Promise<void> {
      const data = await getCategories();
      setCategoriesData(data);
    }
    fetchCategories();

    async function fetchContact(): Promise<void> {
      const data = await getContacts();
      setContactData(data);
    }
    fetchContact();
  }, []);

  //animation
  const container = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP(
    () => {
      const liElem = container.current?.querySelectorAll(
        ".action-list ul > li",
      );

      liElem?.forEach((elem) => {
        const tween = gsap.to(elem, {
          paused: true,
          duration: 0.3,
          borderBottom: "1px solid black",
          color: "#ad8411",
        });

        elem.addEventListener("mouseenter", () => {
          tween.play();
        });
        elem.addEventListener("mouseleave", () => {
          tween.reverse();
        });
      });
    },
    { scope: container, dependencies: [filteredContacts] },
  );

  function handleMouseEnterContact(e: React.MouseEvent): void {
    //animation injection
    const context = contextSafe(() => {
      gsap.to(e.currentTarget, {
        color: "#ad8411",
      });
    });

    context();
  }

  function handleMouseLeaveContact(e: React.MouseEvent): void {
    //animation injection
    const context = contextSafe(() => {
      gsap.to(e.currentTarget, {
        color: "black",
      });
    });

    context();
  }

  async function handleUpdateReadStatus(
    selectedContact: ContactProp,
  ): Promise<void> {
    const newReadStatus = !selectedContact.read;

    //Update the database
    await updateContactRead(selectedContact.id, newReadStatus);

    //updates the state of contact (FilteredContact)
    setContactData((prevContacts) =>
      prevContacts.map((c) =>
        c.id === selectedContact.id ? { ...c, read: newReadStatus } : c,
      ),
    );

    //updates the mark as read button label
    setSelectedContact((prev) =>
      prev ? { ...prev, read: newReadStatus } : null,
    );
  }

  return (
    <div className="p-8">
      <Navbar />
      <div
        ref={container}
        className="wrapper flex lg:flex-row flex-col p-5 gap-20"
      >
        <div className="left-wrapper w-100 h-fit bg-gray-200 rounded-xl ">
          <ActionMenu />
        </div>
        <div className="right-wrapper w-full border">
          <div className="right-content w-full">
            <div className="bg-blue-300 p-2 flex flex-row justify-between items-center">
              <h5>Feedback</h5>
              <select
                className="w-50 border rounded-sm p-2 bg-white"
                onChange={(e) => {
                  if (e.currentTarget.value !== "all") {
                    const categoryId = Number(e.currentTarget.value);
                    //value = 2 , 3 , 4 etc..
                    setSelectedCategory(categoryId);
                  } else {
                    //value = all
                    setSelectedCategory(e.currentTarget.value);
                  }
                }}
              >
                <option value="all">All</option>
                {categoriesData &&
                  categoriesData?.map((cat) => {
                    return (
                      <option key={cat.id} value={cat.id}>
                        {cat.category_type}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="content-wrapper flex flex-row h-200 overflow-hidden">
              <div className="content-list w-100 bg-sky-100 p-5 overflow-y-scroll">
                <ul className="contact-li flex flex-col gap-5">
                  {selectedCategory !== "all" ? (
                    filteredContacts.length !== 0 ? (
                      filteredContacts.map((elem) => {
                        return (
                          <li
                            key={elem.id}
                            className=" cursor-pointer"
                            onClick={() => {
                              setSelectedContact(elem);
                            }}
                            onMouseEnter={handleMouseEnterContact}
                            onMouseLeave={handleMouseLeaveContact}
                          >
                            <div className="flex flex-row justify-between">
                              {elem.subject.slice(0, 20)}.
                              {elem.read && (
                                <span className="font-semibold">(read)</span>
                              )}
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li>NO DATA</li>
                    )
                  ) : contactData.length !== 0 ? (
                    contactData.map((elem) => {
                      return (
                        <li
                          key={elem.id}
                          className=" cursor-pointer"
                          onClick={() => {
                            setSelectedContact(elem);
                          }}
                          onMouseEnter={handleMouseEnterContact}
                          onMouseLeave={handleMouseLeaveContact}
                        >
                          <div className="flex flex-row justify-between">
                            {elem.subject.slice(0, 20)}.
                            {elem.read && (
                              <span className="font-semibold">(read)</span>
                            )}
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li>NO DATA</li>
                  )}
                </ul>
              </div>
              <div className="content bg-gray-100 w-full">
                {selectedContact ? (
                  <div className="content-info p-5">
                    <div className="border-b">
                      <div className="flex flex-row justify-between">
                        <h6>{selectedContact.subject}</h6>

                        <PrimaryButton
                          type="button"
                          label={
                            selectedContact.read
                              ? "Mark it as  unread"
                              : "Mark it as read"
                          }
                          onClick={() => {
                            handleUpdateReadStatus(selectedContact);
                          }}
                        />
                      </div>

                      <p className="text-sm">
                        Category:
                        <span>
                          {
                            categoriesData.find((cat) => {
                              return cat.id === selectedContact.category_id;
                            })?.category_type
                          }
                        </span>
                      </p>
                      <p className="text-sm">
                        From: {selectedContact.sender_name}
                      </p>
                      <p className="text-sm">
                        Email:{" "}
                        <a
                          href={`mailto:${selectedContact.sender_email}`}
                          target="_blank"
                        >
                          {selectedContact.sender_email}
                        </a>
                      </p>
                      <p className="text-sm">
                        Date: {convertDate(selectedContact.created_at)}
                      </p>
                      <p className="text-sm">Message:</p>
                      <div className="text-content px-5 overflow-y-scroll w-full h-170 p-5 border-2 border-gray-200">
                        <p className="text-xl">{selectedContact.message}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-gray-100 flex flex-col justify-center items-center">
                    <h6>Select contact message</h6>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
